"use client";

import { useState, useEffect } from "react";
import { ViewMode, CalendarCell, LifeEvent } from "@/types/calendar";
import { MOCK_BIRTHDATE } from "@/lib/mock-data";
import { generateCalendarGrid, VIEW_MODES } from "@/lib/calendar-logic";
import { cn } from "@/lib/utils";
import { Info, Calendar as CalendarIcon, Pencil, Trash2, Plus, Eye, EyeOff, Settings } from "lucide-react";
import { CalendarSelector } from "@/components/calendar/calendar-selector";
import { ViewSelector } from "@/components/calendar/view-selector";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { Dialog } from "@/components/ui/dialog-simple";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/events/event-form";
import { EventsList } from "@/components/events/events-list";
import { EventCard } from "@/components/events/event-card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEvents } from "@/context/EventsContext";
import Link from "next/link";

type DashboardViewMode = ViewMode | 'list';

export default function Dashboard() {
  const { 
    events, calendars, addEvent, updateEvent, deleteEvent,
    isSettingsOpen, setIsSettingsOpen,
    isEventModalOpen, setIsEventModalOpen,
    editingEvent, setEditingEvent
  } = useEvents();
  const [viewMode, setViewMode] = useState<DashboardViewMode>('weeks');
  const [visibleCalendars, setVisibleCalendars] = useState(calendars.filter(c => c.isVisible).map(c => c.id));
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

  const filteredEvents = events.filter(e => visibleCalendars.includes(e.calendarId));
  
  // Only generate grid if not in list mode
  const gridCells = viewMode === 'list' 
    ? [] 
    : generateCalendarGrid(MOCK_BIRTHDATE, viewMode as ViewMode, filteredEvents);
    
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

      {/* Cell Details Dialog */}
      <Dialog 
        isOpen={!!selectedCell || isEventModalOpen} 
        onClose={handleCloseDialog}
        title={
          isEventModalOpen 
            ? (editingEvent?.id ? "Modifier l'événement" : "Nouvel événement")
            : (selectedCell ? `Détails du ${format(selectedCell.date, 'd MMMM yyyy', { locale: fr })} au ${format(selectedCell.endDate, 'd MMMM yyyy', { locale: fr })}` : "")
        }
      >
        {!isEventModalOpen && selectedCell ? (
          <div className="space-y-4">
              <>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Age : {selectedCell.age} ans</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-900">Événements</h3>
                    {hasHiddenEvents && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHiddenEventsInDialog(!showHiddenEventsInDialog)}
                        className="h-6 text-xs text-slate-500 hover:text-indigo-600"
                      >
                        {showHiddenEventsInDialog ? (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Masquer les autres
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Voir tout
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {selectedCellEvents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCellEvents.map((event) => {
                        const calendar = calendars.find(c => c.id === event.calendarId);
                        const isVisible = visibleCalendars.includes(event.calendarId);
                        
                        return (
                          <EventCard
                            key={event.id}
                            event={event}
                            calendar={calendar}
                            isVisible={isVisible}
                            onEdit={handleEditEvent}
                            onDelete={handleDeleteEvent}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Aucun événement visible pour cette période.</p>
                  )}
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                   <Button 
                     className="w-full"
                     onClick={handleCreateEvent}
                   >
                     <Plus className="w-4 h-4 mr-2" />
                     Ajouter un événement
                   </Button>
                </div>
              </>
          </div>
        ) : (
          <EventForm
            initialData={editingEvent || {}}
            calendars={calendars}
            onSubmit={handleSaveEvent}
            onCancel={() => {
              if (selectedCell) {
                setIsEventModalOpen(false);
                setEditingEvent(null);
              } else {
                handleCloseDialog();
              }
            }}
            submitLabel={editingEvent?.id ? "Mettre à jour" : "Créer"}
          />
        )}
      </Dialog>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}