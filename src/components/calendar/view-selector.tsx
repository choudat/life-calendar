"use client";

import { ViewMode } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

type DashboardViewMode = ViewMode | 'list';

interface ViewSelectorProps {
  value: DashboardViewMode;
  onChange: (value: DashboardViewMode) => void;
}

export function ViewSelector({ value, onChange }: ViewSelectorProps) {

  const renderButton = (mode: DashboardViewMode, label: string, icon: React.ReactNode) => {
    const isSelected = value === mode;
    return (
      <button
        onClick={() => onChange(mode)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-xl transition-all flex-1 justify-center sm:flex-none sm:justify-start",
          isSelected
            ? "bg-indigo-500 text-white shadow-md scale-[1.02]"
            : "text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-800"
        )}
        title={label}
      >
        <span className={cn(
          "flex items-center justify-center w-5 h-5 rounded-lg text-[10px] font-bold shrink-0",
          isSelected ? "bg-white/30 text-white" : "bg-slate-200 text-slate-500"
        )}>
          {icon}
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
      {/* Calendaire */}
      <div className="flex bg-slate-100 p-1 rounded-lg gap-1 overflow-x-auto">
        {renderButton('weeks', 'Semaine', 'S')}
        {renderButton('months', 'Mois', 'M')}
        {renderButton('years', 'Année', 'A')}
      </div>

      {/* Décimale */}
      <div className="flex bg-slate-100 p-1 rounded-lg gap-1 overflow-x-auto">
        {renderButton('days-10', '10 jours', '10')}
        {renderButton('days-100', '100 jours', '100')}
        {renderButton('days-1000', '1000 jours', '1k')}
      </div>

      {/* Evènements */}
      <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
        {renderButton('list', 'Liste', <List className="w-3 h-3" />)}
      </div>
    </div>
  );
}
