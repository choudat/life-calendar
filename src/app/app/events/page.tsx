"use client";

import { useState } from "react";
import { useEvents } from "@/context/EventsContext";
import { LifeEvent } from "@/types/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Dialog } from "@/components/ui/dialog-simple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EventForm } from "@/components/events/event-form";
import { CalendarSelector } from "@/components/calendar/calendar-selector";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const { events, calendars, addEvent, updateEvent, deleteEvent } = useEvents();
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>(calendars.map(c => c.id));
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null);

  const filteredEvents = events
    .filter(e => selectedCalendars.includes(e.calendarId))
    .filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (event: LifeEvent) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleSubmit = (eventData: LifeEvent) => {
    if (editingEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      deleteEvent(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Gestion des événements</h1>
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel événement
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <CalendarSelector 
          calendars={calendars}
          selectedIds={selectedCalendars}
          onChange={setSelectedCalendars}
          className="overflow-x-auto pb-2 md:pb-0"
        />
      </div>

      {/* Events List - Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredEvents.map(event => {
            const calendar = calendars.find(c => c.id === event.calendarId);
            return (
              <div key={event.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{event.icon}</span>
                    <div>
                      <div className="font-medium text-slate-900">{event.title}</div>
                      <div className="text-xs text-slate-500">
                        {format(event.startDate, 'dd MMM yyyy', { locale: fr })}
                        {event.endDate && ` - ${format(event.endDate, 'dd MMM yyyy', { locale: fr })}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(event)}>
                      <Pencil className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
                
                {event.description && (
                  <p className="text-sm text-slate-600">{event.description}</p>
                )}
                
                <Badge 
                  colorClass={calendar?.color.replace('bg-', 'bg-opacity-10 text-').replace('500', '700').replace('600', '800') || "bg-slate-100 text-slate-700"}
                  className="bg-transparent border-0"
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", calendar?.color)} />
                  {calendar?.title}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-500">Date</th>
                <th className="px-6 py-3 font-medium text-slate-500">Titre</th>
                <th className="px-6 py-3 font-medium text-slate-500">Calendrier</th>
                <th className="px-6 py-3 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map(event => {
                const calendar = calendars.find(c => c.id === event.calendarId);
                return (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {format(event.startDate, 'dd MMM yyyy', { locale: fr })}
                      {event.endDate && ` - ${format(event.endDate, 'dd MMM yyyy', { locale: fr })}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{event.icon}</span>
                        <div>
                          <div className="font-medium text-slate-900">{event.title}</div>
                          {event.description && (
                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{event.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        colorClass={calendar?.color.replace('bg-', 'bg-opacity-10 text-').replace('500', '700').replace('600', '800') || "bg-slate-100 text-slate-700"}
                        className="bg-transparent border-0"
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", calendar?.color)} />
                        {calendar?.title}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(event)}>
                          <Pencil className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                    Aucun événement trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingEvent ? "Modifier l'événement" : "Nouvel événement"}
      >
        <EventForm
          initialData={editingEvent || {}}
          calendars={calendars}
          onSubmit={handleSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingEvent ? "Mettre à jour" : "Créer"}
        />
      </Dialog>
    </div>
  );
}

