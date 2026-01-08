import { CalendarCell, CalendarCategory, ViewMode, LifeEvent } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMemo } from "react";

interface CalendarGridProps {
  cells: CalendarCell[];
  viewMode: ViewMode;
  calendars: CalendarCategory[];
  visibleCalendars: string[];
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
      gap: 3px;
      padding: 4px;
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

export function CalendarGrid({ cells, viewMode, calendars, visibleCalendars, onCellClick }: CalendarGridProps) {
  const getViewClass = (mode: ViewMode) => {
    if (mode === 'weeks') return 'view-weeks';
    if (mode === 'months') return 'view-months';
    if (mode === 'years') return 'view-years';
    return 'view-days';
  };

  // Create a lookup map for calendar order (O(1) instead of O(n) for findIndex)
  const calendarOrderMap = useMemo(() => {
    const map = new Map<string, number>();
    calendars.forEach((cal, index) => map.set(cal.id, index));
    return map;
  }, [calendars]);

  // Create a lookup map for calendar colors
  const calendarColorMap = useMemo(() => {
    const map = new Map<string, string>();
    calendars.forEach(cal => map.set(cal.id, cal.color));
    return map;
  }, [calendars]);

  const getEventColor = (event: LifeEvent) => {
    return calendarColorMap.get(event.calendarId) || 'bg-slate-200';
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
          // Filter visible events first (O(n) instead of generating a new grid)
          const visibleEvents = cell.events.filter(e => visibleCalendars.includes(e.calendarId));

          // Sort events by calendar order using the lookup map (O(n log n) with O(1) lookups)
          const sortedEvents = visibleEvents.length > 1
            ? [...visibleEvents].sort((a, b) =>
              (calendarOrderMap.get(a.calendarId) ?? 999) - (calendarOrderMap.get(b.calendarId) ?? 999)
            )
            : visibleEvents;

          const primaryEvent = sortedEvents[0];
          const hasEvents = sortedEvents.length > 0;
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
                "aspect-square rounded-[3px] md:rounded-[4px] transition-all relative group cursor-pointer flex items-center justify-center overflow-hidden",

                // Background
                cell.isPast
                  ? "bg-slate-50/50"
                  : "bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.05)]",

                // Hover effect
                "hover:scale-110 hover:z-20 hover:shadow-md",

                // Current date highlight
                cell.isCurrent && "ring-2 ring-indigo-400 ring-offset-1 z-10",

                // Event Background - use a slightly more opaque background for periods
                hasEvents && isPeriod && eventColor,
                hasEvents && isPeriod && "opacity-90 hover:opacity-100",

                // Single event highlight (dot or icon)
                hasEvents && !isPeriod && "bg-white",

                // Year separator visual (more subtle)
                isYearStart && i !== 0 && "before:content-[''] before:absolute before:-left-[2.5px] before:top-0 before:bottom-0 before:w-[2px] before:bg-slate-200 before:z-20"
              )}
              title={`${format(cell.date, 'dd/MM/yyyy')} - Age: ${cell.age}`}
            >
              {/* Icon for single events or start of period */}
              {hasEvents && (primaryEvent.icon || (!isPeriod && !primaryEvent.icon)) && (
                <span className={cn(
                  "text-[9px] md:text-[11px] leading-none select-none transition-transform group-hover:scale-110",
                  !isPeriod && eventColor.replace('bg-', 'text-').replace('-200', '-500').replace('-100', '-400')
                )}>
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
