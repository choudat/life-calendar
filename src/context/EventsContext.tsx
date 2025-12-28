"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LifeEvent, CalendarCategory } from '@/types/calendar';
import { MOCK_EVENTS, MOCK_CALENDARS } from '@/lib/mock-data';

interface EventsContextType {
  events: LifeEvent[];
  calendars: CalendarCategory[];
  addEvent: (event: LifeEvent) => void;
  updateEvent: (event: LifeEvent) => void;
  deleteEvent: (id: string) => void;
  addCalendar: (calendar: CalendarCategory) => void;
  updateCalendar: (calendar: CalendarCategory) => void;
  deleteCalendar: (id: string) => void;
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
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<LifeEvent[]>(MOCK_EVENTS);
  const [calendars, setCalendars] = useState<CalendarCategory[]>(MOCK_CALENDARS);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<LifeEvent> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem("life-calendar-data");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        
        // Restore dates for events
        if (parsed.events) {
          const restoredEvents = parsed.events.map((e: any) => ({
            ...e,
            startDate: new Date(e.startDate),
            endDate: e.endDate ? new Date(e.endDate) : undefined
          }));
          setEvents(restoredEvents);
        }
        
        if (parsed.calendars) {
          setCalendars(parsed.calendars);
        }
      } catch (error) {
        console.error("Failed to load data from localStorage", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    
    const dataToSave = {
      events,
      calendars
    };
    localStorage.setItem("life-calendar-data", JSON.stringify(dataToSave));
  }, [events, calendars, isLoaded]);

  const addEvent = (event: LifeEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (updatedEvent: LifeEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const importEvents = (newEvents: LifeEvent[]) => {
    setEvents(prev => {
      const eventMap = new Map(prev.map(e => [e.id, e]));
      newEvents.forEach(e => eventMap.set(e.id, e));
      return Array.from(eventMap.values());
    });
  };

  const clearAllEvents = () => {
    setEvents([]);
  };

  const resetToMockData = () => {
    setEvents(MOCK_EVENTS);
  };

  const addCalendar = (calendar: CalendarCategory) => {
    setCalendars(prev => [...prev, calendar]);
  };

  const updateCalendar = (updatedCalendar: CalendarCategory) => {
    setCalendars(prev => prev.map(c => c.id === updatedCalendar.id ? updatedCalendar : c));
  };

  const deleteCalendar = (id: string) => {
    setCalendars(prev => prev.filter(c => c.id !== id));
    // Also delete events associated? Or keep them?
    // Usually safer to keep them or ask, but for now let's just delete the calendar.
    // Events will be orphaned or hidden.
    // Let's filter events too for consistency in this simple app.
    setEvents(prev => prev.filter(e => e.calendarId !== id));
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
      importEvents,
      clearAllEvents,
      resetToMockData,
      isSettingsOpen,
      setIsSettingsOpen,
      isEventModalOpen,
      setIsEventModalOpen,
      editingEvent,
      setEditingEvent
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
