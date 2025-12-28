import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { LifeEvent, CalendarCategory } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: LifeEvent;
  calendar?: CalendarCategory;
  onEdit: (event: LifeEvent) => void;
  onDelete: (id: string) => void;
  isVisible?: boolean;
  className?: string;
}

export function EventCard({ 
  event, 
  calendar, 
  onEdit, 
  onDelete, 
  isVisible = true,
  className 
}: EventCardProps) {
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border group transition-colors relative",
        isVisible 
          ? "bg-slate-50 border-slate-100" 
          : "bg-slate-50/50 border-slate-100 opacity-75",
        className
      )}
    >
      <div className={cn("w-2 h-2 mt-1.5 rounded-full shrink-0", calendar?.color || "bg-slate-200")} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="font-medium text-sm flex items-center gap-2 truncate">
            <span className="shrink-0">{event.icon}</span>
            <span className="truncate">{event.title}</span>
          </div>
          
          {calendar && (
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap shrink-0",
              "bg-white border border-slate-100 text-slate-500"
            )}>
              {calendar.title}
            </span>
          )}
        </div>
        
        {event.description && (
          <p className="text-xs text-slate-500 mb-1 line-clamp-2">{event.description}</p>
        )}
        
        <div className="text-xs text-slate-400">
          {format(event.startDate, 'dd MMM yyyy', { locale: fr })} 
          {event.endDate && ` - ${format(event.endDate, 'dd MMM yyyy', { locale: fr })}`}
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bottom-2 bg-slate-50/80 backdrop-blur-sm rounded-md p-0.5 md:static md:bg-transparent md:p-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:text-indigo-600"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
