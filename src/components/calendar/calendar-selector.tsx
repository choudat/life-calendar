import React, { useState } from 'react';
import { CalendarCategory } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Settings, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog-simple";
import { CalendarForm } from "./calendar-form";
import { useEvents } from "@/context/EventsContext";

interface CalendarSelectorProps {
  calendars: CalendarCategory[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
}

export function CalendarSelector({ calendars, selectedIds, onChange, className }: CalendarSelectorProps) {
  const { addCalendar, updateCalendar, deleteCalendar } = useEvents();
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<CalendarCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const allIds = calendars.map(c => c.id);
  const isAllSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
  const isNoneSelected = selectedIds.length === 0;

  const handleSelectAll = () => onChange(allIds);
  const handleSelectNone = () => onChange([]);
  
  const toggleCalendar = (id: string, e: React.MouseEvent) => {
    // UX Expert Tip: Alt+Click to isolate a category (show only this one)
    if (e.altKey) {
      onChange([id]);
      return;
    }

    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(currentId => currentId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleSaveCalendar = (data: CalendarCategory) => {
    if (editingCalendar) {
      updateCalendar(data);
      setEditingCalendar(null);
    } else {
      addCalendar(data);
      setIsCreating(false);
      // Auto-select the new calendar
      onChange([...selectedIds, data.id]);
    }
  };

  const handleDeleteCalendar = (id: string) => {
    if (confirm("Supprimer ce calendrier et tous ses événements ?")) {
      deleteCalendar(id);
      onChange(selectedIds.filter(cid => cid !== id));
    }
  };

  return (
    <>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {/* Global Controls - Reduced visual noise with icons */}
        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5 border border-slate-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSelectAll}
            disabled={isAllSelected}
            title="Tout afficher"
            className="h-7 w-7 text-slate-500 hover:text-indigo-600 hover:bg-white"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSelectNone}
            disabled={isNoneSelected}
            title="Tout masquer"
            className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-white"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-200 mx-0.5" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsManageOpen(true)}
            title="Gérer les calendriers"
            className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />
        
        {calendars.map(cal => {
          const isSelected = selectedIds.includes(cal.id);
          return (
            <Button
              key={cal.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={(e) => toggleCalendar(cal.id, e)}
              title="Alt + Clic pour afficher uniquement ce calendrier"
              className={cn(
                "whitespace-nowrap gap-2 transition-all",
                !isSelected && "opacity-60 hover:opacity-100 bg-slate-50 border-slate-200 border-dashed"
              )}
            >
              <span 
                className={cn("w-2 h-2 rounded-full transition-colors", cal.color)} 
                style={{ backgroundColor: isSelected ? 'white' : undefined }} 
              />
              {cal.title}
            </Button>
          )
        })}
      </div>

      <Dialog
        isOpen={isManageOpen}
        onClose={() => {
          setIsManageOpen(false);
          setEditingCalendar(null);
          setIsCreating(false);
        }}
        title={editingCalendar ? "Modifier le calendrier" : (isCreating ? "Nouveau calendrier" : "Gérer les calendriers")}
      >
        {editingCalendar || isCreating ? (
          <CalendarForm
            initialData={editingCalendar || {}}
            onSubmit={handleSaveCalendar}
            onCancel={() => {
              setEditingCalendar(null);
              setIsCreating(false);
            }}
            submitLabel={editingCalendar ? "Mettre à jour" : "Créer"}
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {calendars.map(cal => (
                <div key={cal.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-4 h-4 rounded-full", cal.color)} />
                    <span className="font-medium text-sm">{cal.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                      onClick={() => setEditingCalendar(cal)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-600"
                      onClick={() => handleDeleteCalendar(cal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => setIsCreating(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un calendrier
            </Button>
          </div>
        )}
      </Dialog>
    </>
  );
}
