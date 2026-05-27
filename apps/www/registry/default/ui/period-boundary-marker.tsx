import { cn } from '@/registry/default/lib/utils'
import type * as React from 'react'

export interface PeriodBoundaryMarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left offset as a percentage of the parent track / timeline. */
  offsetPct: number
  /** Optional label rendered above the line as a tab. */
  label?: string
}

/**
 * Vertical line + optional label tab marking a period boundary in a
 * timeline (e.g. start of a new fortnight, week, or pay cycle). Used by
 * timeline-view + period-navigator to make cadence visible.
 */
export function PeriodBoundaryMarker({
  offsetPct,
  label,
  className,
  style,
  ...props
}: PeriodBoundaryMarkerProps) {
  return (
    <div
      role="presentation"
      style={{ left: `${offsetPct}%`, ...style }}
      className={cn('pointer-events-none absolute top-0 bottom-0 z-10 -translate-x-px', className)}
      {...props}
    >
      <div className="h-full w-px bg-primary/40" />
      {label && (
        <span className="absolute -top-px left-1 -translate-y-full rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-primary-foreground uppercase">
          {label}
        </span>
      )}
    </div>
  )
}
