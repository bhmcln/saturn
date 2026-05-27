import { lightFormat, parseISO } from 'date-fns'
import { formatInTimeZone as formatInTimeZoneTz, toZonedTime } from 'date-fns-tz'

export type DateInput = string | Date | null | undefined

/** Parse an ISO string or Date into a Date. Returns null if invalid. */
export function parseDate(input: DateInput): Date | null {
  if (!input) return null
  if (input instanceof Date) return input
  try {
    return parseISO(input)
  } catch {
    return null
  }
}

/**
 * Parse "YYYY-MM-DD" as local-midnight, avoiding the gotcha where
 * `new Date("2024-01-15")` is interpreted as UTC and lands on the
 * previous day in westward timezones.
 */
export function parseLocalDate(dateStr: string): Date {
  const datePart = dateStr.split('T')[0] ?? dateStr
  return new Date(`${datePart}T00:00:00`)
}

/** Format a Date as "YYYY-MM-DD" using local components (not UTC). */
export function formatLocalDate(date: Date): string {
  return lightFormat(date, 'yyyy-MM-dd')
}

/** Convert a Date into its representation in `timezone`. */
export function toTimezone(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone)
}

/** Format a Date in `timezone` using a date-fns format pattern. */
export function formatInTimeZone(date: Date, timezone: string, pattern: string): string {
  return formatInTimeZoneTz(date, timezone, pattern)
}

/**
 * Minutes since midnight for `date`, optionally in `timezone`. Keystone
 * helper for any minute-positioned timeline rendering — gives consistent
 * results across branches with different timezones, which a naive
 * `getHours() * 60 + getMinutes()` would not.
 */
export function getMinutesSinceMidnight(date: Date, timezone?: string): number {
  const zoned = timezone ? toZonedTime(date, timezone) : date
  return zoned.getHours() * 60 + zoned.getMinutes()
}
