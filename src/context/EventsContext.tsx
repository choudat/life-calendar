"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LifeEvent, CalendarCategory } from '@/types/calendar';
import { MOCK_EVENTS, MOCK_CALENDARS } from '@/lib/mock-data';
import { parseLocalDate, formatLocalDate } from '@/lib/utils';
import { createEventAction, updateEventAction, deleteEventAction, getEventsAction } from '@/actions/events-actions';
import { createCalendarAction, updateCalendarAction, deleteCalendarAction, getCalendarsAction, reorderCalendarsAction } from '@/actions/calendar-actions';
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
             // Calendars and birthDate handled by server/logic
             if (parsed.birthDate) setBirthDate(new Date(parsed.birthDate));
             if (parsed.lifeExpectancy) setLifeExpectancy(Number(parsed.lifeExpectancy));
        }

        if (!userId) {
            setEvents([]); // MOCK_EVENTS if we want to show demo data for guests?
            setIsLoaded(true);
            return;
        }

        try {
            // Fetch Events
            const eventsResult = await getEventsAction();
            if (eventsResult.success && eventsResult.data) {
                const mappedEvents: LifeEvent[] = eventsResult.data.map(e => ({
                     id: e.id,
                     title: e.title,
                     calendarId: e.calendarId,
                     startDate: e.startDate, // Server Action returns Date
                     endDate: e.endDate,
                     description: e.description || undefined,
                     icon: e.icon || undefined,
                }));
                setEvents(mappedEvents);
            }

            // Fetch Calendars
            const calendarResult = await getCalendarsAction();
            if (calendarResult.success && calendarResult.data) {
                if (calendarResult.data.length > 0) {
                     // Use DB Calendars
                     setCalendars(calendarResult.data.map(c => ({
                        id: c.id,
                        title: c.title,
                        color: c.color,
                        isVisible: c.isVisible,
                        icon: undefined // DB doesn't have icon yet? Schema has icon? No, I missed it in schema read? Double check.
                     })));
                } else {
                     // Empty DB, but maybe user wants defaults? 
                     // For now, keep mock or empty. 
                     // Let's seed MOCK if empty for better UX?
                     // setCalendars(MOCK_CALENDARS); // Optimistic UI
                     // seedCalendars(MOCK_CALENDARS); // Async save to DB
                     
                     // Current Logic: If empty, use MOCK for initial view but DO NOT SAVE automatically
                     // This mimics "New User" template. 
                     // But if we persist, we must save them when they edit.
                     // A cleaner approach: If server has 0, show 0. Or show defaults as "unsaved".
                     
                     // Let's stick to: If empty, use MOCK_CALENDARS locally for now so the UI isn't broken.
                     // But this desyncs. 
                     // Let's create defaults on the server if empty!
                     
                     const promises = MOCK_CALENDARS.map((c, index) => createCalendarAction({
                        title: c.title,
                        color: c.color,
                        isVisible: c.isVisible,
                        position: index
                     }));
                     const results = await Promise.all(promises);
                     // Then re-fetch or use results
                     const created = results
                        .filter(r => r.success && r.data)
                        .map(r => r.data!)
                        .sort((a,b) => a.position - b.position);
                     
                     if (created.length > 0) {
                        setCalendars(created.map(c => ({
                            id: c.id,
                            title: c.title,
                            color: c.color,
                            isVisible: c.isVisible,
                        })));
                     }
                }
            }
        } catch (e) {
            console.error("Error loading data", e);
        }
        
        setIsLoaded(true);
    }
    init();
  }, [userId, isAuthLoaded]);

  // Save Settings to localStorage (Events & Calendars now Server-Side)
  useEffect(() => {
    if (!isLoaded) return;
    const dataToSave = {
      // calendars removed from local storage sync
      birthDate,
      lifeExpectancy
    };
    localStorage.setItem("life-calendar-data", JSON.stringify(dataToSave));
  }, [birthDate, lifeExpectancy, isLoaded]);

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
    // Optimistic:
    setEvents(prev => [...prev, ...newEvents]); // Simplified merge
    
    // Server: Loop and create
    newEvents.forEach(e => addEvent(e));
  };

  const clearAllEvents = () => {
    if(confirm("Are you sure? This will delete all events in DB.")) {
         events.forEach(e => deleteEvent(e.id));
    }
  };

  const resetToMockData = () => {
     setEvents(MOCK_EVENTS);
  };

  const addCalendar = async (calendar: CalendarCategory) => {
    // Optimistic
    setCalendars(prev => [...prev, calendar]);

    // Server
    const serverResult = await createCalendarAction({
        id: calendar.id, // Explicitly pass the UUID generated by the client
        title: calendar.title,
        color: calendar.color,
        isVisible: calendar.isVisible,
        position: calendars.length // Append to end
    });

    if (serverResult.success && serverResult.data) {
        // ID should match, but we can verify
        // const newId = serverResult.data.id; 
    } else {
        setCalendars(prev => prev.filter(c => c.id !== calendar.id));
        alert("Failed to create calendar");
    }
  };

  const updateCalendar = async (updatedCalendar: CalendarCategory) => {
    setCalendars(prev => prev.map(c => c.id === updatedCalendar.id ? updatedCalendar : c));

    const serverResult = await updateCalendarAction(updatedCalendar.id, {
        title: updatedCalendar.title,
        color: updatedCalendar.color,
        isVisible: updatedCalendar.isVisible
    });
    
    if (!serverResult.success) {
        alert("Failed to update calendar");
    }
  };

  const deleteCalendar = async (id: string) => {
    const previous = [...calendars];
    setCalendars(prev => prev.filter(c => c.id !== id));
    setEvents(prev => prev.filter(e => e.calendarId !== id));

    const serverResult = await deleteCalendarAction(id);
    if (!serverResult.success) {
        setCalendars(previous);
        alert("Failed to delete calendar");
    }
  };

  const reorderCalendars = async (calendarIds: string[]) => {
    setCalendars(prev => {
      const newCalendars = [...prev];
      return newCalendars.sort((a, b) => {
        return calendarIds.indexOf(a.id) - calendarIds.indexOf(b.id);
      });
    });

    const updates = calendarIds.map((id, index) => ({ id, position: index }));
    const serverResult = await reorderCalendarsAction(updates);
    
    if (!serverResult.success) {
        alert("Failed to reorder calendars");
    }
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
