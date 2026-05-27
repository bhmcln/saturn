import { formatHour as defaultFormatHour, eachHourOfDay } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'
import type * as React from 'react'

export interface TimeGutterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Day to label (only the date is used for localization). Defaults to now. */
  date?: Date
  /**
   * Top offset to reserve for a sticky day-labels header. Hour labels are
   * positioned within the remaining area so they align with the event
   * grid's hour-row boundaries. Defaults to "1.75rem" (h-7).
   */
  headerHeight?: string
  /** Override the per-hour label formatter. */
  formatHour?: (date: Date) => string
}

/**
 * Sticky-left column of hour labels for vertical-time views (week-view,
 * day-view). Labels are positioned via `top: %` so the parent's event grid
 * doesn't need to know about them, as long as the gutter and the grid live
 * in the same flex row and share a height.
 */
export function TimeGutter({
  date = new Date(),
  headerHeight = '1.75rem',
  formatHour = defaultFormatHour,
  className,
  ...props
}: TimeGutterProps) {
  const hours = eachHourOfDay(date)
  return (
    <div
      className={cn(
        'relative sticky left-0 z-20 w-14 flex-none bg-background ring-1 ring-border',
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0" style={{ top: headerHeight }}>
        {hours.map((hour, i) => (
          <div
            key={hour.getHours()}
            className="absolute right-0 left-0 -mt-2.5 pr-2 text-right text-xs/5 text-muted-foreground"
            style={{ top: `${(i / 24) * 100}%` }}
          >
            {formatHour(hour)}
          </div>
        ))}
      </div>
    </div>
  )
}
