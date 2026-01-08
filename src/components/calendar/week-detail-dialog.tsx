"use client";

import * as React from "react";
import { useMediaQuery } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CalendarCell, LifeEvent, CalendarCategory } from "@/types/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Eye, EyeOff, Plus } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { EventForm } from "@/components/events/event-form";

interface WeekDetailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cell: CalendarCell | null;
    events: LifeEvent[];
    calendars: CalendarCategory[];
    visibleCalendars: string[];
    onVisibleCalendarsChange: (ids: string[]) => void;
    // Actions
    onEditEvent: (event: LifeEvent) => void;
    onDeleteEvent: (id: string) => void;
    onCreateEvent: () => void;
    // Editing State
    isEditing: boolean;
    editingEvent: Partial<LifeEvent> | null;
    onSaveEvent: (event: LifeEvent) => void;
    onCancelEdit: () => void;
}

export function WeekDetailDialog({
    isOpen,
    onClose,
    cell,
    events,
    calendars,
    visibleCalendars,
    onVisibleCalendarsChange,
    onEditEvent,
    onDeleteEvent,
    onCreateEvent,
    isEditing,
    editingEvent,
    onSaveEvent,
    onCancelEdit
}: WeekDetailDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    
    // Internal state for "Show Hidden"
    const [showHidden, setShowHidden] = React.useState(false);

    if (!cell && !isEditing) return null;

    // Content Props
    const title = isEditing 
        ? (editingEvent?.id ? "Modifier l'événement" : "Nouvel événement")
        : (cell ? `Semaine du ${format(cell.date, 'd MMMM yyyy', { locale: fr })}` : "");

    const filteredEvents = cell 
        ? cell.events.filter(e => showHidden || visibleCalendars.includes(e.calendarId))
        : [];
    
    const hasHiddenEvents = cell
        ? cell.events.some(e => !visibleCalendars.includes(e.calendarId))
        : false;

    const renderContent = () => {
        if (isEditing) {
            return (
                <div className="p-4">
                     <EventForm
                        initialData={editingEvent || {}}
                        calendars={calendars}
                        onSubmit={onSaveEvent}
                        onCancel={onCancelEdit}
                        submitLabel={editingEvent?.id ? "Mettre à jour" : "Créer"}
                    />
                </div>
            );
        }

        if (!cell) return null;

        return (
             <div className="p-4 space-y-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <CalendarIcon className="w-4 h-4 text-indigo-500" />
                    <span>Age lors de cette semaine : <span className="font-semibold text-slate-900">{cell.age} an{cell.age > 1 ? 's' : ''}</span></span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-900">Événements</h3>
                         {hasHiddenEvents && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowHidden(!showHidden)}
                                className="h-6 text-xs text-slate-500 hover:text-indigo-600 px-2"
                            >
                                {showHidden ? (
                                    <>
                                        <EyeOff className="w-3 h-3 mr-1" />
                                        Masquer
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3 h-3 mr-1" />
                                        Voir masqués
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {filteredEvents.length > 0 ? (
                        <div className="space-y-3">
                            {filteredEvents.map((event) => {
                                const calendar = calendars.find(c => c.id === event.calendarId);
                                const isVisible = visibleCalendars.includes(event.calendarId);
                                return (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        calendar={calendar}
                                        isVisible={isVisible}
                                        onEdit={onEditEvent}
                                        onDelete={onDeleteEvent}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            Aucun événement marqué pour cette période.
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <Button onClick={onCreateEvent} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un événement
                    </Button>
                </div>
            </div>
        );
    };

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {renderContent()}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent>
                <DrawerHeader className="text-left border-b border-slate-100 pb-4">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                {renderContent()}
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
