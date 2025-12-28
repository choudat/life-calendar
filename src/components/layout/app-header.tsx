"use client";

import Link from "next/link";
import { Calendar, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/context/EventsContext";

export function AppHeader() {
  const { setIsSettingsOpen, setIsEventModalOpen, setEditingEvent, calendars } = useEvents();

  const handleCreateEvent = () => {
    setEditingEvent({
      startDate: new Date(),
      calendarId: calendars[0]?.id
    });
    setIsEventModalOpen(true);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:opacity-80 transition-opacity">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Life Calendar</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsSettingsOpen(true)} 
            size="icon" 
            variant="ghost" 
            className="text-slate-500 hover:text-slate-900 rounded-full" 
            title="Paramètres"
          >
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button 
            onClick={handleCreateEvent} 
            className="gap-2 rounded-full" 
            title="Ajouter un événement"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>

          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs ml-2">
            FC
          </div>
        </div>
      </div>
    </header>
  );
}
