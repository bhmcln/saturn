'use client'

import { type ActivityType, activityColors } from '@/registry/default/lib/activity-colors'
import { cn } from '@/registry/default/lib/utils'
import type * as React from 'react'

export interface ShiftSegment {
  type: ActivityType
  /**
   * Explicit weight in the accent bar. If omitted and `start` + `end` are
   * provided, the segment's weight is derived from its duration.
   */
  weight?: number
  start?: Date
  end?: Date
}

function computeWeights(segments: ShiftSegment[]): number[] {
  return segments.map((s) => {
    if (s.weight !== undefined) return Math.max(0, s.weight)
    if (s.start && s.end) return Math.max(0, s.end.getTime() - s.start.getTime())
    return 1
  })
}

export interface ShiftBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Activity segments rendered as a stacked colored accent bar along the
   * left edge. Segment heights are proportional to weight (or to
   * `end - start` if both are provided).
   */
  segments?: ShiftSegment[]
  /** Optional badge rendered at the top-right (added / dropped / modified / warning). */
  badge?: React.ReactNode
}

function ShiftBlockRoot({ segments = [], badge, className, children, ...props }: ShiftBlockProps) {
  const weights = computeWeights(segments)
  const total = weights.reduce((a, b) => a + b, 0) || 1

  return (
    <div
      className={cn(
        'group/shift relative flex h-full min-h-0 flex-col overflow-hidden rounded-md border bg-card pl-1.5 text-xs shadow-xs transition-colors hover:bg-accent',
        className,
      )}
      {...props}
    >
      {segments.length > 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 left-0 flex w-1 flex-col overflow-hidden rounded-l-md"
        >
          {segments.map((seg, i) => (
            <div
              key={`${seg.type}-${i}`}
              className={activityColors(seg.type).accent}
              style={{ height: `${((weights[i] ?? 0) / total) * 100}%` }}
            />
          ))}
        </div>
      )}
      {badge && <div className="absolute top-1 right-1 z-10">{badge}</div>}
      <div className="flex min-h-0 flex-1 flex-col gap-0.5 px-2 py-1.5">{children}</div>
    </div>
  )
}

function Title({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('truncate font-medium text-foreground', className)} {...props} />
}

function Meta({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('truncate text-muted-foreground', className)} {...props} />
}

export const ShiftBlock = Object.assign(ShiftBlockRoot, { Title, Meta })
