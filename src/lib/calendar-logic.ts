import { addDays, addMonths, addYears, differenceInYears, startOfWeek } from "date-fns";
import { ViewMode, CalendarCell, LifeEvent } from "@/types/calendar";

export const VIEW_MODES: Record<ViewMode, { unitDays: number; columnsPerRow: number; label: string }> = {
  'weeks': { unitDays: 7, columnsPerRow: 52, label: 'Semaine' },
  'months': { unitDays: 30.44, columnsPerRow: 12, label: 'Mois' },
  'years': { unitDays: 365.25, columnsPerRow: 10, label: 'Année' },
  'days-10': { unitDays: 10, columnsPerRow: 36, label: '10 jours' },
  'days-100': { unitDays: 100, columnsPerRow: 50, label: '100 jours' },
  'days-1000': { unitDays: 1000, columnsPerRow: 30, label: '1000 jours' },
};

export function generateCalendarGrid(
  birthDate: Date,
  viewMode: ViewMode,
  events: LifeEvent[],
  yearsToRender: number = 100
): CalendarCell[] {
  const config = VIEW_MODES[viewMode];
  const totalUnits = Math.ceil((yearsToRender * 365.25) / config.unitDays);
  const cells: CalendarCell[] = [];
  const today = new Date();

  let currentDate = viewMode === 'weeks' ? startOfWeek(birthDate, { weekStartsOn: 1 }) : birthDate;

  // 1. Generate all cells first (O(Cells))
  for (let i = 0; i < totalUnits; i++) {
    let nextDate: Date;
    
    if (viewMode === 'months') {
      nextDate = addMonths(currentDate, 1);
    } else if (viewMode === 'years') {
      nextDate = addYears(currentDate, 1);
    } else {
      nextDate = addDays(currentDate, config.unitDays);
    }

    const cellEndDate = addDays(nextDate, -1);
    
    cells.push({
      date: currentDate,
      endDate: cellEndDate,
      age: differenceInYears(currentDate, birthDate),
      events: [], // Initialize empty
      isPast: cellEndDate < today,
      isCurrent: currentDate <= today && cellEndDate >= today,
    });

    currentDate = nextDate;
  }

  // 2. Pre-calculate timestamps for binary search (O(Cells))
  const cellStartTimes = cells.map(c => c.date.getTime());
  const cellEndTimes = cells.map(c => c.endDate.getTime());

  // 3. Populate events (O(Events * log(Cells)))
  events.forEach(event => {
    const eventStart = new Date(event.startDate).getTime();
    const eventEnd = event.endDate 
      ? new Date(event.endDate).getTime() 
      : eventStart;

    // Find range of cells that overlap with this event
    const startIndex = findStartIndex(cellEndTimes, eventStart);
    const endIndex = findEndIndex(cellStartTimes, eventEnd);

    if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
      for (let i = startIndex; i <= endIndex; i++) {
        cells[i].events.push(event);
      }
    }
  });

  return cells;
}

function findStartIndex(sortedValues: number[], target: number): number {
  let low = 0;
  let high = sortedValues.length - 1;
  let result = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedValues[mid] >= target) {
      result = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return result;
}

function findEndIndex(sortedValues: number[], target: number): number {
  let low = 0;
  let high = sortedValues.length - 1;
  let result = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedValues[mid] <= target) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}
