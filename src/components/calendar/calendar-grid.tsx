import { CalendarCell, CalendarCategory, ViewMode, LifeEvent } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CalendarGridProps {
  cells: CalendarCell[];
  viewMode: ViewMode;
  calendars: CalendarCategory[];
  onCellClick: (cell: CalendarCell) => void;
}

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

export function CalendarGrid({ cells, viewMode, calendars, onCellClick }: CalendarGridProps) {
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

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
      <style dangerouslySetInnerHTML={{ __html: getGridStyles() }} />
      <div 
        className={cn(
          "calendar-grid",
          getViewClass(viewMode)
        )}
      >
        {cells.map((cell, i) => {
          const primaryEvent = cell.events[0];
          const hasEvents = cell.events.length > 0;
          const isPeriod = primaryEvent?.endDate;
          
          // Check if this cell starts a new year (age changed from previous cell)
          const prevCell = cells[i - 1];
          const isYearStart = i === 0 || cell.age !== prevCell?.age;
          
          // Event styling
          const eventColor = primaryEvent ? getEventColor(primaryEvent) : '';
          
          return (
            <div
              key={i}
              onClick={() => onCellClick(cell)}
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
  );
}
