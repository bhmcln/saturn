'use client'

import { type UseTimeGridReturn, useTimeGrid } from '@/registry/default/hooks/use-time-grid'
import { cn } from '@/registry/default/lib/utils'
import { eachHourOfInterval, format } from 'date-fns'
import * as React from 'react'

interface TimelineContextValue extends UseTimeGridReturn {
  labelWidth: string
}

const TimelineContext = React.createContext<TimelineContextValue | null>(null)

/** Hook to read the parent TimelineView's viewport + position helper. */
export function useTimeline(): TimelineContextValue {
  const ctx = React.useContext(TimelineContext)
  if (!ctx) {
    throw new Error('TimelineView.* subcomponents must be rendered inside <TimelineView>')
  }
  return ctx
}

export interface TimelineViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Inclusive start of the visible time window. */
  viewportStart: Date
  /** Exclusive end of the visible time window. */
  viewportEnd: Date
  /** Width of the sticky-left label gutter. Defaults to "12rem". */
  labelWidth?: string
}

function TimelineViewRoot({
  viewportStart,
  viewportEnd,
  labelWidth = '12rem',
  className,
  children,
  ...props
}: TimelineViewProps) {
  const grid = useTimeGrid({ viewportStart, viewportEnd })
  const value = React.useMemo<TimelineContextValue>(
    () => ({ ...grid, labelWidth }),
    [grid, labelWidth],
  )
  return (
    <TimelineContext.Provider value={value}>
      <div className={cn('flex h-full flex-col bg-background', className)} {...props}>
        {children}
      </div>
    </TimelineContext.Provider>
  )
}

function Header({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn('flex flex-none items-center justify-between border-b px-6 py-3', className)}
      {...props}
    />
  )
}

interface HourRulerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Format string for hour labels (date-fns). Defaults to "h a". */
  hourFormat?: string
}

function HourRuler({ className, hourFormat = 'h a', ...props }: HourRulerProps) {
  const { viewportStart, viewportEnd, viewportMs, labelWidth } = useTimeline()
  const hours = React.useMemo(
    () => eachHourOfInterval({ start: viewportStart, end: viewportEnd }),
    [viewportStart, viewportEnd],
  )

  return (
    <div
      className={cn('sticky top-0 z-20 flex flex-none border-b bg-background', className)}
      {...props}
    >
      <div className="flex-none border-r" style={{ width: labelWidth }} />
      <div className="relative flex-auto" style={{ height: '2.5rem' }}>
        {hours.map((hour, i) => {
          const offsetMs = hour.getTime() - viewportStart.getTime()
          const offsetPct = (offsetMs / viewportMs) * 100
          if (offsetPct < 0 || offsetPct > 100) return null
          return (
            <div
              key={hour.toISOString()}
              className="absolute top-0 bottom-0 flex items-center"
              style={{ left: `${offsetPct}%` }}
            >
              {i > 0 && <span className="absolute top-0 bottom-0 w-px bg-border/60" />}
              <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                {format(hour, hourFormat)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Body({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative flex flex-auto flex-col overflow-auto', className)} {...props}>
      {children}
    </div>
  )
}

export const TimelineView = Object.assign(TimelineViewRoot, {
  Header,
  HourRuler,
  Body,
})
