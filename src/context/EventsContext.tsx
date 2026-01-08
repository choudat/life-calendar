"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LifeEvent, CalendarCategory } from '@/types/calendar';
import { MOCK_EVENTS, MOCK_CALENDARS } from '@/lib/mock-data';
import { parseLocalDate, formatLocalDate } from '@/lib/utils';
import { createEventAction, updateEventAction, deleteEventAction, getEventsAction } from '@/actions/events-actions';
import { useAuth } from '@clerk/nextjs';

// ... existing interfaces ...
interface EventsContextType {
  events: LifeEvent[];
  calendars: CalendarCategory[];
  addEvent: (event: LifeEvent) => void;
  updateEvent: (event: LifeEvent) => void;
  deleteEvent: (id: string) => void;
  addCalendar: (calendar: CalendarCategory) => void;
  updateCalendar: (calendar: CalendarCategory) => void;
  deleteCalendar: (id: string) => void;
  reorderCalendars: (calendarIds: string[]) => void;
  importEvents: (events: LifeEvent[]) => void;
  clearAllEvents: () => void;
  resetToMockData: () => void;

  // UI State
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  isEventModalOpen: boolean;
  setIsEventModalOpen: (isOpen: boolean) => void;
  editingEvent: Partial<LifeEvent> | null;
  setEditingEvent: (event: Partial<LifeEvent> | null) => void;

  // Settings State
  birthDate: Date;
  setBirthDate: (date: Date) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (years: number) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [calendars, setCalendars] = useState<CalendarCategory[]>(MOCK_CALENDARS);
  
  // User Settings State
  const [birthDate, setBirthDate] = useState<Date>(parseLocalDate("1907-01-15"));
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  
  const [isLoaded, setIsLoaded] = useState(false);

  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<LifeEvent> | null>(null);

  // Load from Server on mount
  useEffect(() => {
    async function init() {
        if (!isAuthLoaded) return;

        // Fallback to local storage for Settings only, or use DB for settings too later
        const storedData = localStorage.getItem("life-calendar-data");
        if (storedData) {
             const parsed = JSON.parse(storedData);
             if (parsed.calendars) setCalendars(parsed.calendars);
             if (parsed.birthDate) setBirthDate(new Date(parsed.birthDate));
             if (parsed.lifeExpectancy) setLifeExpectancy(Number(parsed.lifeExpectancy));
        }

        if (!userId) {
            setEvents([]); // MOCK_EVENTS if we want to show demo data for guests?
            setIsLoaded(true);
            return;
        }

        // Fetch Events from Server
        try {
            const result = await getEventsAction();
            if (result.success && result.data) {
                const mappedEvents: LifeEvent[] = result.data.map(e => ({
                     id: e.id,
                     title: e.title,
                     calendarId: e.calendarId,
                     startDate: e.startDate, // Server Action returns Date
                     endDate: e.endDate,
                     description: e.description || undefined,
                     icon: e.icon || undefined,
                }));
                // Merge with Mock if empty? No, respect DB.
                // If DB is empty, user starts fresh.
                setEvents(mappedEvents);
            } else {
                console.error("Failed to fetch events from server:", result.error);
                // Fallback to localStorage events if server fails?
                // For now, let's assume server is primary.
            }
        } catch (e) {
            console.error("Error loading events", e);
        }
        
        setIsLoaded(true);
    }
    init();
  }, [userId, isAuthLoaded]);

  // Save Settings to localStorage (Events are now Server-Side)
  useEffect(() => {
    if (!isLoaded) return;
    const dataToSave = {
      calendars, // Calendar settings still local for now
      birthDate,
      lifeExpectancy
      // No events
    };
    localStorage.setItem("life-calendar-data", JSON.stringify(dataToSave));
  }, [calendars, birthDate, lifeExpectancy, isLoaded]);

  const addEvent = async (event: LifeEvent) => {
    // Optimistic Update
    setEvents(prev => [...prev, event]);

    // Server Call
    const serverResult = await createEventAction({
        id: event.id,
        title: event.title,
        calendarId: event.calendarId,
        startDate: formatLocalDate(event.startDate),
        endDate: event.endDate ? formatLocalDate(event.endDate) : undefined,
        description: event.description,
        icon: event.icon
    });

    if (!serverResult.success) {
        // Rollback
        setEvents(prev => prev.filter(e => e.id !== event.id));
        alert("Failed to save event");
    }
  };

  const updateEvent = async (updatedEvent: LifeEvent) => {
    // Optimistic Update
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));

    // Server Call
    const serverResult = await updateEventAction(updatedEvent.id, {
        title: updatedEvent.title,
        calendarId: updatedEvent.calendarId,
        startDate: formatLocalDate(updatedEvent.startDate),
        endDate: updatedEvent.endDate ? formatLocalDate(updatedEvent.endDate) : undefined,
        description: updatedEvent.description,
        icon: updatedEvent.icon
    });

    if (!serverResult.success) {
        // Rollback? Harder to rollback update without previous state tracking.
        // For now, refresh from server or alert.
        alert("Failed to update event");
    }
  };

  const deleteEvent = async (id: string) => {
    // Optimistic Update
    const previousEvents = [...events];
    setEvents(prev => prev.filter(e => e.id !== id));

    // Server Call
    const serverResult = await deleteEventAction(id);

    if (!serverResult.success) {
        // Rollback
        setEvents(previousEvents);
        alert("Failed to delete event");
    }
  };

  const importEvents = (newEvents: LifeEvent[]) => {
    // This needs to be batched or looped. 
    // Optimistic:
    setEvents(prev => [...prev, ...newEvents]); // Simplified merge
    
    // Server: Loop and create
    newEvents.forEach(e => addEvent(e));
  };

  const clearAllEvents = () => {
    // Dangerous! 
    if(confirm("Are you sure? This will delete all events in DB.")) {
         events.forEach(e => deleteEvent(e.id));
    }
  };

  const resetToMockData = () => {
     // For dev:
     setEvents(MOCK_EVENTS);
     // Note: This doesn't sync to DB automatically unless we call addEvent for each.
  };

  const addCalendar = (calendar: CalendarCategory) => {
    setCalendars(prev => [...prev, calendar]);
  };

  const updateCalendar = (updatedCalendar: CalendarCategory) => {
    setCalendars(prev => prev.map(c => c.id === updatedCalendar.id ? updatedCalendar : c));
  };

  const deleteCalendar = (id: string) => {
    setCalendars(prev => prev.filter(c => c.id !== id));
    // Filter local events only for UI consistency
    setEvents(prev => prev.filter(e => e.calendarId !== id));
  };

  const reorderCalendars = (calendarIds: string[]) => {
    setCalendars(prev => {
      const newCalendars = [...prev];
      return newCalendars.sort((a, b) => {
        return calendarIds.indexOf(a.id) - calendarIds.indexOf(b.id);
      });
    });
  };

  return (
    <EventsContext.Provider value={{
      events,
      calendars,
      addEvent,
      updateEvent,
      deleteEvent,
      addCalendar,
      updateCalendar,
      deleteCalendar,
      reorderCalendars,
      importEvents,
      clearAllEvents,
      resetToMockData,
      isSettingsOpen,
      setIsSettingsOpen,
      isEventModalOpen,
      setIsEventModalOpen,
      editingEvent,
      setEditingEvent,
      birthDate,
      setBirthDate,
      lifeExpectancy,
      setLifeExpectancy
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
