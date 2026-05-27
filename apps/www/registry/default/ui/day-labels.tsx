import { cn } from '@/registry/default/lib/utils'
import { format, isToday } from 'date-fns'
import type * as React from 'react'

export interface DayLabelsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Days to label, one cell per entry. */
  days: Date[]
  /**
   * Width of the sticky-left time gutter column to skip at the start, so
   * the day cells align with the day columns in the events grid below.
   * Defaults to "3.5rem" (w-14).
   */
  gutterWidth?: string
}

/**
 * Sticky-top row of day-of-week + day-of-month labels. Used by week-view
 * and any other multi-day grid that needs a header strip. The active "today"
 * cell highlights its day number in bg-primary / text-primary-foreground.
 */
export function DayLabels({
  days,
  gutterWidth = '3.5rem',
  className,
  style,
  ...props
}: DayLabelsProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-30 flex-none bg-background shadow-sm ring-1 ring-border sm:pr-8',
        className,
      )}
      style={style}
      {...props}
    >
      <div
        className="-mr-px hidden border-r text-sm/6 text-muted-foreground sm:grid"
        style={{
          gridTemplateColumns: `${gutterWidth} repeat(${days.length}, minmax(0, 1fr))`,
        }}
      >
        <div className="col-start-1" />
        {days.map((day) => {
          const today = isToday(day)
          return (
            <div
              key={day.toISOString()}
              className="flex items-center justify-center border-l py-3 first-of-type:border-l-0"
            >
              <span className={cn(today && 'flex items-baseline')}>
                {format(day, 'EEE')}{' '}
                <span
                  className={cn(
                    today
                      ? 'ml-1.5 flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground'
                      : 'items-center justify-center font-semibold text-foreground',
                  )}
                >
                  {format(day, 'd')}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
