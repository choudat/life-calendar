export type ViewMode = 'weeks' | 'months' | 'years' | 'days-10' | 'days-100' | 'days-1000';

export interface CalendarCategory {
  id: string;
  title: string;
  icon?: string;
  color: string;
  isVisible: boolean;
}

export interface LifeEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date; // If present, it's a period
  isRecurring?: boolean;
  recurrenceType?: 'monthly' | 'yearly';
  icon?: string;
}

export interface CalendarCell {
  date: Date;
  endDate: Date; // The end of this time unit
  age: number; // Age in years at this point
  events: LifeEvent[];
  isPast: boolean;
  isCurrent: boolean;
}
