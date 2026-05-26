import {
  addDays,
  addHours,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface TimeRangeOptions {
  weekStartsOn?: WeekStartsOn
}

/** Seven dates covering the week containing `date`. */
export function getWeekDays(date: Date, { weekStartsOn = 0 }: TimeRangeOptions = {}): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn }),
    end: endOfWeek(date, { weekStartsOn }),
  })
}

/**
 * Dates for the calendar grid containing the month of `date`. Pads to 6 weeks
 * (42 cells) so the grid stays a stable size across months.
 */
export function getMonthGrid(date: Date, { weekStartsOn = 0 }: TimeRangeOptions = {}): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn })
  const end = addDays(start, 41)
  return eachDayOfInterval({ start, end })
}

/** 24 dates, one per hour, for the day of `date`. */
export function eachHourOfDay(date: Date): Date[] {
  return eachHourOfInterval({ start: startOfDay(date), end: endOfDay(date) })
}

/** Locale-aware short hour label, e.g. "12 AM", "1 PM". */
export function formatHour(date: Date): string {
  return format(date, 'h a')
}

/** Locale-aware short time label, e.g. "6:00 AM". */
export function formatTime(date: Date): string {
  return format(date, 'h:mm a')
}

/** Position within a day as a fraction in [0, 1]. Useful for event placement. */
export function dayFraction(date: Date): number {
  const minutes = differenceInMinutes(date, startOfDay(date))
  return minutes / (24 * 60)
}

export { addDays, addHours, isSameDay, isSameMonth, isToday, startOfDay }
