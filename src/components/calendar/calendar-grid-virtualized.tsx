"use client";

import { CalendarCell, CalendarCategory, ViewMode, LifeEvent } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMemo, useRef, useEffect, useState } from "react";
import { useWindowVirtualizer } from '@tanstack/react-virtual';

interface CalendarGridProps {
    cells: CalendarCell[];
    viewMode: ViewMode;
    calendars: CalendarCategory[];
    visibleCalendars: string[];
    onCellClick: (cell: CalendarCell) => void;
}

// Calculate columns based on viewport and view mode
const getColumnCount = (viewMode: ViewMode, width: number): number => {
    if (viewMode === 'weeks') {
        if (width < 640) return 13;
        if (width < 1024) return 26;
        return 52;
    }
    if (viewMode === 'months') {
        if (width < 640) return 12;
        if (width < 1024) return 24;
        if (width < 1280) return 36;
        return 48;
    }
    if (viewMode === 'years') {
        if (width < 640) return 10;
        if (width < 1024) return 20;
        if (width < 1280) return 30;
        return 40;
    }
    // days modes
    if (width < 640) return 20;
    if (width < 1024) return 40;
    if (width < 1280) return 60;
    return 100;
};

export function CalendarGrid({ cells, viewMode, calendars, visibleCalendars, onCellClick }: CalendarGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1024);

    // Track container width for responsive columns
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

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

    // Calculate grid dimensions
    const columnCount = getColumnCount(viewMode, containerWidth);
    const rowCount = Math.ceil(cells.length / columnCount);
    // Adjusted cell size calculation to avoid tiny gaps or overflows
    // We reserve some minimal spacing. 
    // Gap is handled by CSS grid gap, usually passed via parent class or inline style
    const gap = 3;
    // Calculate approximate cell size for height estimation
    const estimatedCellSize = (containerWidth - (columnCount - 1) * gap) / columnCount;

    const rowVirtualizer = useWindowVirtualizer({
        count: rowCount,
        estimateSize: () => estimatedCellSize + gap, // Row height + gap
        overscan: 5,
        scrollMargin: containerRef.current?.offsetTop ?? 0,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();

    return (
        <div ref={containerRef} className="w-full">
            <div
                className="relative w-full"
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                }}
            >
                {virtualRows.map((virtualRow) => {
                    const rowStartIndex = virtualRow.index * columnCount;
                    const rowCells = cells.slice(rowStartIndex, rowStartIndex + columnCount);

                    return (
                        <div
                            key={virtualRow.index}
                            className="absolute top-0 left-0 w-full grid"
                            style={{
                                height: `${virtualRow.size - gap}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                                gap: `${gap}px`
                            }}
                        >
                            {rowCells.map((cell, colIndex) => {
                                const cellIndex = rowStartIndex + colIndex;

                                // Filter visible events
                                const visibleEvents = cell.events.filter(e => visibleCalendars.includes(e.calendarId));

                                // Sort events
                                const sortedEvents = visibleEvents.length > 1
                                    ? [...visibleEvents].sort((a, b) =>
                                        (calendarOrderMap.get(a.calendarId) ?? 999) - (calendarOrderMap.get(b.calendarId) ?? 999)
                                    )
                                    : visibleEvents;

                                const primaryEvent = sortedEvents[0];
                                const hasEvents = sortedEvents.length > 0;
                                const isPeriod = primaryEvent?.endDate;

                                // Check if this cell starts a new year
                                const prevCell = cellIndex > 0 ? cells[cellIndex - 1] : null;
                                const isYearStart = cellIndex === 0 || cell.age !== prevCell?.age;

                                const eventColor = primaryEvent ? getEventColor(primaryEvent) : '';

                                return (
                                    <div
                                        key={colIndex}
                                        className="w-full h-full relative"
                                        onClick={() => onCellClick(cell)}
                                    >
                                        <div
                                            className={cn(
                                                "w-full h-full rounded-[3px] md:rounded-[4px] transition-all relative group cursor-pointer flex items-center justify-center overflow-hidden",

                                                // Background
                                                cell.isPast
                                                    ? "bg-stone-900" // Past: Stone-900 (Dark)
                                                    : "bg-stone-200 border border-stone-300", // Future: Stone-200 (Light)

                                                // Hover effect
                                                "hover:scale-110 hover:z-20 hover:shadow-md",

                                                // Current date highlight
                                                cell.isCurrent && "ring-2 ring-indigo-400 ring-offset-1 z-10 animate-pulse",

                                                // Event Background
                                                hasEvents && isPeriod && eventColor,
                                                hasEvents && isPeriod && "opacity-90 hover:opacity-100",

                                                // Single event highlight
                                                hasEvents && !isPeriod && "bg-white",
                                            )}
                                            title={`${format(cell.date, 'dd/MM/yyyy')} - Age: ${cell.age}`}
                                        >
                                            {/* Icon */}
                                            {hasEvents && (primaryEvent.icon || (!isPeriod && !primaryEvent.icon)) && (
                                                <span className={cn(
                                                    "text-[9px] md:text-[11px] leading-none select-none transition-transform group-hover:scale-110",
                                                    !isPeriod && eventColor.replace('bg-', 'text-').replace('-200', '-500').replace('-100', '-400')
                                                )}>
                                                    {primaryEvent.icon || "•"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
