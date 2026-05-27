'use client'

import { format, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { addDays, formatTime } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'
import { DayLabels as DayLabelsPrimitive } from '@/registry/default/ui/day-labels'
import { EventCard, type EventColor } from '@/registry/default/ui/event-card'
import { TimeGutter } from '@/registry/default/ui/time-gutter'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color?: EventColor
  meta?: Record<string, unknown>
}

interface MultiDayViewContextValue {
  date: Date
  days: Date[]
  dayCount: number
  events: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

const MultiDayViewContext = React.createContext<MultiDayViewContextValue | null>(null)

function useMultiDayView() {
  const ctx = React.useContext(MultiDayViewContext)
  if (!ctx) {
    throw new Error('MultiDayView.* subcomponents must be rendered inside <MultiDayView>')
  }
  return ctx
}

export interface MultiDayViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  date: Date
  /** Number of consecutive days to show, starting at `date`. Defaults to 3. */
  days?: number
  events?: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

function MultiDayViewRoot({
  date,
  days = 3,
  events = [],
  onDateChange,
  onEventClick,
  className,
  children,
  ...props
}: MultiDayViewProps) {
  const dayList = React.useMemo(
    () => Array.from({ length: days }, (_, i) => addDays(date, i)),
    [date, days],
  )
  const value = React.useMemo<MultiDayViewContextValue>(
    () => ({
      date,
      days: dayList,
      dayCount: days,
      events,
      onDateChange,
      onEventClick,
    }),
    [date, dayList, days, events, onDateChange, onEventClick],
  )
  return (
    <MultiDayViewContext.Provider value={value}>
      <div className={cn('flex h-full flex-col', className)} {...props}>
        {children}
      </div>
    </MultiDayViewContext.Provider>
  )
}

function Header({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn('flex flex-none items-center justify-between border-b px-6 py-4', className)}
      {...props}
    />
  )
}

function Title({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { days } = useMultiDayView()
  const first = days[0]
  const last = days[days.length - 1]
  if (!first || !last) return null
  return (
    <h1 className={cn('text-base font-semibold text-foreground', className)} {...props}>
      <time dateTime={format(first, 'yyyy-MM-dd')}>{format(first, 'MMM d')}</time>
      <span className="mx-1.5 text-muted-foreground">–</span>
      <time dateTime={format(last, 'yyyy-MM-dd')}>{format(last, 'MMM d, yyyy')}</time>
    </h1>
  )
}

function Navigation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { date, dayCount, onDateChange } = useMultiDayView()
  return (
    <div
      className={cn(
        'relative flex items-center rounded-md border bg-background shadow-xs md:items-stretch',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={() => onDateChange?.(addDays(date, -dayCount))}
        className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-muted-foreground hover:text-foreground md:w-9 md:pr-0 md:hover:bg-accent"
      >
        <span className="sr-only">Previous range</span>
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => onDateChange?.(new Date())}
        className="hidden border-x px-3.5 text-sm font-semibold text-foreground hover:bg-accent md:block"
      >
        Today
      </button>
      <span className="relative -mx-px h-5 w-px bg-border md:hidden" />
      <button
        type="button"
        onClick={() => onDateChange?.(addDays(date, dayCount))}
        className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-muted-foreground hover:text-foreground md:w-9 md:pl-0 md:hover:bg-accent"
      >
        <span className="sr-only">Next range</span>
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </div>
  )
}

function Body({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('isolate flex flex-auto flex-col overflow-auto bg-background', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DayLabels({ className }: { className?: string }) {
  const { days } = useMultiDayView()
  return <DayLabelsPrimitive days={days} className={className} />
}

function Grid({ className }: { className?: string }) {
  const { date, days, dayCount, events, onEventClick } = useMultiDayView()
  // Build a fractional grid based on dayCount via gridTemplateColumns.
  const colsTemplate = `repeat(${dayCount}, minmax(0, 1fr))`

  return (
    <div className={cn('flex flex-auto', className)}>
      <TimeGutter date={date} />
      <div className="grid flex-auto grid-cols-1 grid-rows-1">
        {/* Horizontal hour lines */}
        <div
          style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
          className="col-start-1 col-end-2 row-start-1 grid divide-y divide-border"
        >
          <div className="row-end-1 h-7" />
          {Array.from({ length: 48 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stable 48-row grid
            <div key={i} />
          ))}
        </div>

        {/* Vertical day-column lines */}
        <div
          style={{ gridTemplateColumns: colsTemplate }}
          className="col-start-1 col-end-2 row-start-1 hidden grid-rows-1 divide-x divide-border sm:grid"
        >
          {days.map((day) => (
            <div key={day.toISOString()} className="row-span-full" />
          ))}
        </div>

        {/* Events */}
        <ol
          style={{
            gridTemplateColumns: colsTemplate,
            gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
          }}
          className="col-start-1 col-end-2 row-start-1 grid"
        >
          {events.map((event) => {
            const dayIndex = days.findIndex((d) => isSameDay(d, event.start))
            if (dayIndex === -1) return null
            const startMinutes = event.start.getHours() * 60 + event.start.getMinutes()
            const durationMinutes = Math.max(
              5,
              (event.end.getTime() - event.start.getTime()) / 60000,
            )
            const rowStart = Math.floor(startMinutes / 5) + 2
            const rowSpan = Math.ceil(durationMinutes / 5)
            return (
              <li
                key={event.id}
                style={{
                  gridRow: `${rowStart} / span ${rowSpan}`,
                  gridColumnStart: dayIndex + 1,
                }}
                className="relative mt-px flex dark:before:pointer-events-none dark:before:absolute dark:before:inset-1 dark:before:z-0 dark:before:rounded-lg dark:before:bg-background"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <EventCard
                      color={event.color ?? 'gray'}
                      className="absolute inset-1 cursor-pointer"
                      onClick={() => onEventClick?.(event)}
                    >
                      <EventCard.Title>{event.title}</EventCard.Title>
                      <EventCard.Time>
                        <time dateTime={event.start.toISOString()}>{formatTime(event.start)}</time>
                      </EventCard.Time>
                    </EventCard>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-semibold">{event.title}</p>
                    <p className="opacity-80">
                      {formatTime(event.start)} – {formatTime(event.end)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export const MultiDayView = Object.assign(MultiDayViewRoot, {
  Header,
  Title,
  Navigation,
  Body,
  DayLabels,
  Grid,
})
