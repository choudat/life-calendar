"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ViewMode, CalendarCell, LifeEvent } from "@/types/calendar";
import { generateCalendarGrid, VIEW_MODES } from "@/lib/calendar-logic";
import { cn } from "@/lib/utils";
import { Info, Calendar as CalendarIcon, Pencil, Trash2, Plus, Eye, EyeOff, Settings } from "lucide-react";
import { CalendarSelector } from "@/components/calendar/calendar-selector";
import { ViewSelector } from "@/components/calendar/view-selector";
import { CalendarGrid } from "@/components/calendar/calendar-grid-virtualized";
// import { Dialog } from "@/components/ui/dialog-simple"; // Removed in favor of responsive component or reused inside it if needed
import { WeekDetailDialog } from "@/components/calendar/week-detail-dialog"; // New component
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/events/event-form";
import { EventsList } from "@/components/events/events-list";
import { EventCard } from "@/components/events/event-card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEvents } from "@/context/EventsContext";
import { BirthDateInput } from "@/components/onboarding/birth-date-input";

type DashboardViewMode = ViewMode | 'list';

export default function Dashboard() {
  const {
    events, calendars, addEvent, updateEvent, deleteEvent,
    isSettingsOpen, setIsSettingsOpen,
    isEventModalOpen, setIsEventModalOpen,
    editingEvent, setEditingEvent,
    birthDate, lifeExpectancy
  } = useEvents();
  const [viewMode, setViewMode] = useState<DashboardViewMode>('weeks');
  
  // Initialize with all IDs, but this won't be enough for async updates
  const [visibleCalendars, setVisibleCalendars] = useState<string[]>([]);
  const prevCalendarsRef = useRef(calendars);
  
  // Sync visibleCalendars when calendars list changes
  useEffect(() => {
    // 1. Initial Load: If nothing selected, select all visible defaults
    if (visibleCalendars.length === 0 && calendars.length > 0) {
        setVisibleCalendars(calendars.filter(c => c.isVisible).map(c => c.id));
    } else {
        // 2. New Calendar Added: Auto-select it
        const currentIds = calendars.map(c => c.id);
        const prevIds = prevCalendarsRef.current.map(c => c.id);
        const newIds = currentIds.filter(id => !prevIds.includes(id));
        
        if (newIds.length > 0) {
            setVisibleCalendars(prev => Array.from(new Set([...prev, ...newIds])));
        }
        
        // 3. Cleanup: Remove deleted calendars
        // Only run this if we didn't just add new ones (to avoid conflict or double render, though React handles it)
        // Actually safe to combine logic implies running filter on valid IDs
        setVisibleCalendars(prev => {
             // If we just added logic above, 'prev' here is stale? No, functional update queues it.
             // Let's just do it in one pass if possible, but hard to combine with "Initial Load" state check.
             // Simpler: Just ensure we filter invalid IDs.
             const valid = prev.filter(id => currentIds.includes(id));
             
             // If we have new IDs, add them
             if (newIds.length > 0) {
                 return Array.from(new Set([...valid, ...newIds]));
             }
             return valid;
        });
    }
    prevCalendarsRef.current = calendars;
  }, [calendars]);

  const [breakpoint, setBreakpoint] = useState<'base' | 'sm' | 'lg' | 'xl'>('base');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('base');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLineLabel = () => {
    if (viewMode === 'list') return '';

    if (viewMode === 'weeks') {
      if (breakpoint === 'base') return '1 trimestre';
      if (breakpoint === 'sm') return '1 semestre';
      return '1 année';
    }
    if (viewMode === 'months') {
      if (breakpoint === 'base') return '1 an';
      if (breakpoint === 'sm') return '2 ans';
      if (breakpoint === 'lg') return '3 ans';
      return '4 ans';
    }
    if (viewMode === 'years') {
      if (breakpoint === 'base') return '10 ans';
      if (breakpoint === 'sm') return '20 ans';
      if (breakpoint === 'lg') return '30 ans';
      return '40 ans';
    }

    // Days views
    const unit = VIEW_MODES[viewMode].unitDays;
    let cols = 20;
    if (breakpoint === 'sm') cols = 40;
    if (breakpoint === 'lg') cols = 60;
    if (breakpoint === 'xl') cols = 100;

    return `${(unit * cols).toLocaleString('fr-FR')} jours`;
  };

  // Dialog & Editing State
  const [selectedCell, setSelectedCell] = useState<CalendarCell | null>(null);
  const [showHiddenEventsInDialog, setShowHiddenEventsInDialog] = useState(false);

  // Memoize grid generation - only recalculate when events or viewMode change
  // Filtering is now done at render time for better performance
  const gridCells = useMemo(() => {
    if (viewMode === 'list') return [];
    return generateCalendarGrid(birthDate, viewMode as ViewMode, events, lifeExpectancy);
  }, [viewMode, events, birthDate, lifeExpectancy]);

  const config = viewMode === 'list' ? VIEW_MODES['weeks'] : VIEW_MODES[viewMode as ViewMode];

  // Handlers
  const handleCellClick = (cell: CalendarCell) => {
    setSelectedCell(cell);
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setShowHiddenEventsInDialog(false);
  };

  const handleCloseDialog = () => {
    setSelectedCell(null);
    setIsEventModalOpen(false);
    setEditingEvent(null);
    setShowHiddenEventsInDialog(false);
  };

  const handleCreateEvent = () => {
    if (!selectedCell) return;
    setEditingEvent({
      startDate: selectedCell.date,
      calendarId: calendars[0]?.id
    });
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: LifeEvent) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: LifeEvent) => {
    if (events.some(e => e.id === eventData.id)) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      deleteEvent(id);
    }
  };

  // Derive events for the currently selected cell to ensure reactivity
  const selectedCellEvents = selectedCell
    ? events.filter(e => {
      // Filter by visibility unless "Show All" is active
      if (!showHiddenEventsInDialog && !visibleCalendars.includes(e.calendarId)) {
        return false;
      }

      const cellStart = selectedCell.date;
      const cellEnd = selectedCell.endDate;

      const eventStart = new Date(e.startDate);
      const eventEnd = e.endDate ? new Date(e.endDate) : eventStart;

      // Check for overlap: Event Start <= Cell End AND Cell Start <= Event End
      return eventStart <= cellEnd && cellStart <= eventEnd;
    })
    : [];

  const hasHiddenEvents = selectedCell
    ? events.some(e => {
      if (visibleCalendars.includes(e.calendarId)) return false;

      const cellStart = selectedCell.date;
      const cellEnd = selectedCell.endDate;
      const eventStart = new Date(e.startDate);
      const eventEnd = e.endDate ? new Date(e.endDate) : eventStart;

      return eventStart <= cellEnd && cellStart <= eventEnd;
    })
    : false;

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">

        {/* View Mode Selector */}
        <div className="w-full md:w-auto">
          <ViewSelector
            value={viewMode}
            onChange={setViewMode}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <CalendarSelector
            calendars={calendars}
            selectedIds={visibleCalendars}
            onChange={setVisibleCalendars}
          />
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        <EventsList
          visibleCalendars={visibleCalendars}
          onVisibleCalendarsChange={setVisibleCalendars}
          showFilters={false}
        />
      ) : (
        /* Calendar Grid */
        <CalendarGrid
          cells={gridCells}
          viewMode={viewMode as ViewMode}
          calendars={calendars}
          visibleCalendars={visibleCalendars}
          onCellClick={handleCellClick}
        />
      )}

      {viewMode !== 'list' && (
        <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-slate-500 justify-center text-center">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Chaque case représente {config.unitDays} jours.</span>
          </div>
          <span className="hidden md:inline">•</span>
          <span>Chaque ligne représente {getLineLabel()}.</span>
          <span className="hidden md:inline">•</span>
          <span>Vous avez vécu {Math.floor(gridCells.filter(c => c.isPast).length * config.unitDays / 365.25)} années.</span>
        </div>
      )}

      {/* Cell Details Dialog / Drawer */}
      <WeekDetailDialog
          isOpen={!!selectedCell || isEventModalOpen}
          onClose={handleCloseDialog}
          cell={selectedCell}
          events={selectedCellEvents}
          calendars={calendars}
          visibleCalendars={visibleCalendars}
          onVisibleCalendarsChange={setVisibleCalendars} // Optional, if we want to toggle inside modal
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onCreateEvent={handleCreateEvent}
          isEditing={isEventModalOpen}
          editingEvent={editingEvent}
          onSaveEvent={handleSaveEvent}
          onCancelEdit={() => {
              if (selectedCell) {
                  setIsEventModalOpen(false);
                  setEditingEvent(null);
                  // Keep cell selected so we go back to read mode
              } else {
                  handleCloseDialog();
              }
          }}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}