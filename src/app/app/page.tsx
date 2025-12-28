"use client";

import { useState, useEffect } from "react";
import { ViewMode, CalendarCell, LifeEvent } from "@/types/calendar";
import { MOCK_BIRTHDATE } from "@/lib/mock-data";
import { generateCalendarGrid, VIEW_MODES } from "@/lib/calendar-logic";
import { cn } from "@/lib/utils";
import { Info, Calendar as CalendarIcon, Pencil, Trash2, Plus, Eye, EyeOff, Settings } from "lucide-react";
import { CalendarSelector } from "@/components/calendar/calendar-selector";
import { ViewSelector } from "@/components/calendar/view-selector";
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

const getGridStyles = () => {
  const borderStyle = "border-right-color: white !important;";
  
  const createRules = (className: string, configs: { min: number; max?: number; cols: number }[]) => {
    return configs.map(({ min, max, cols }) => {
      const selectors = [];
      for (let i = 5; i < cols; i += 5) {
        selectors.push(`.${className} > div:nth-child(${cols}n + ${i})`);
      }
      
      const ruleContent = `
        .${className} { grid-template-columns: repeat(${cols}, minmax(0, 1fr)); }
        ${selectors.length > 0 ? `${selectors.join(', ')} { ${borderStyle} }` : ''}
      `;

      if (min === 0 && !max) return ruleContent;
      
      const queryParts = [];
      if (min > 0) queryParts.push(`(min-width: ${min}px)`);
      if (max) queryParts.push(`(max-width: ${max}px)`);
      
      return `@media ${queryParts.join(' and ')} { ${ruleContent} }`;
    }).join('\n');
  };

  return `
    .calendar-grid {
      display: grid;
      gap: 1px;
      width: 100%;
      transition: all 0.3s ease;
    }
    
    ${createRules('view-weeks', [
      { min: 0, max: 639, cols: 13 },
      { min: 640, max: 1023, cols: 26 },
      { min: 1024, cols: 52 }
    ])}

    ${createRules('view-months', [
      { min: 0, max: 639, cols: 12 },
      { min: 640, max: 1023, cols: 24 },
      { min: 1024, max: 1279, cols: 36 },
      { min: 1280, cols: 48 }
    ])}

    ${createRules('view-years', [
      { min: 0, max: 639, cols: 10 },
      { min: 640, max: 1023, cols: 20 },
      { min: 1024, max: 1279, cols: 30 },
      { min: 1280, cols: 40 }
    ])}

    ${createRules('view-days', [
      { min: 0, max: 639, cols: 20 },
      { min: 640, max: 1023, cols: 40 },
      { min: 1024, max: 1279, cols: 60 },
      { min: 1280, cols: 100 }
    ])}
  `;
};

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

  const getViewClass = (mode: ViewMode) => {
    if (mode === 'weeks') return 'view-weeks';
    if (mode === 'months') return 'view-months';
    if (mode === 'years') return 'view-years';
    return 'view-days';
  };

  const getEventColor = (event: LifeEvent) => {
    const calendar = calendars.find(c => c.id === event.calendarId);
    return calendar?.color || 'bg-slate-200';
  };

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
        // This covers all cases: event inside cell, cell inside event, partial overlap
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
      <style dangerouslySetInnerHTML={{ __html: getGridStyles() }} />

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        
        {/* View Mode Selector */}
        <div className="w-full md:w-auto">
          <ViewSelector 
            value={viewMode} 
            onChange={setViewMode}
          />
        </div>

        {/* Calendar Filters */}
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
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div 
            className={cn(
              "calendar-grid",
              getViewClass(viewMode as ViewMode)
            )}
          >
            {gridCells.map((cell, i) => {
              const primaryEvent = cell.events[0];
              const hasEvents = cell.events.length > 0;
              const isPeriod = primaryEvent?.endDate;
              
              // Check if this cell starts a new year (age changed from previous cell)
              const prevCell = gridCells[i - 1];
              const isYearStart = i === 0 || cell.age !== prevCell?.age;
              
              // Event styling
              const eventColor = primaryEvent ? getEventColor(primaryEvent) : '';
              
              return (
                <div
                  key={i}
                  onClick={() => handleCellClick(cell)}
                  className={cn(
                    "aspect-square rounded-[1px] transition-all relative group cursor-pointer flex items-center justify-center overflow-hidden",
                    // Base borders
                    "border-r-[3px] border-transparent",
                    
                    // Background
                    cell.isPast ? "bg-slate-100" : "bg-white",
                    !cell.isPast && "ring-[0.5px] ring-inset ring-slate-100",
                    
                    // Current date highlight
                    cell.isCurrent && "ring-2 ring-indigo-500 z-10",
                    
                    // Event Background
                    hasEvents && isPeriod && eventColor,
                    hasEvents && isPeriod && "opacity-80 hover:opacity-100",
                    
                    // Year separator visual
                    isYearStart && "before:content-[''] before:absolute before:-left-[2px] before:top-0 before:bottom-0 before:w-[2px] before:bg-slate-400 before:z-20"
                  )}
                  title={`${format(cell.date, 'dd/MM/yyyy')} - Age: ${cell.age}`}
                >
                  {/* Icon for single events or start of period */}
                  {hasEvents && (primaryEvent.icon || (!isPeriod && !primaryEvent.icon)) && (
                     <span className="text-[8px] md:text-[10px] leading-none select-none">
                       {primaryEvent.icon || "•"}
                     </span>
                  )}
                  
                  {/* Year Label */}
                  {isYearStart && (
                     <span className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-right w-6">
                       {cell.age}
                     </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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