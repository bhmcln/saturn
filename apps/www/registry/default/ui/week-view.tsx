'use client'

import { format, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import {
  type WeekStartsOn,
  addDays,
  eachHourOfDay,
  formatHour,
  formatTime,
  getWeekDays,
} from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'
import { EventCard, type EventColor } from '@/registry/default/ui/event-card'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color?: EventColor
  meta?: Record<string, unknown>
}

interface WeekViewContextValue {
  date: Date
  weekDays: Date[]
  weekStartsOn: WeekStartsOn
  events: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

const WeekViewContext = React.createContext<WeekViewContextValue | null>(null)

function useWeekView() {
  const ctx = React.useContext(WeekViewContext)
  if (!ctx) {
    throw new Error('WeekView.* subcomponents must be rendered inside <WeekView>')
  }
  return ctx
}

export interface WeekViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  date: Date
  events?: CalendarEvent[]
  weekStartsOn?: WeekStartsOn
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

function WeekViewRoot({
  date,
  events = [],
  weekStartsOn = 0,
  onDateChange,
  onEventClick,
  className,
  children,
  ...props
}: WeekViewProps) {
  const weekDays = React.useMemo(() => getWeekDays(date, { weekStartsOn }), [date, weekStartsOn])
  const value = React.useMemo<WeekViewContextValue>(
    () => ({ date, weekDays, weekStartsOn, events, onDateChange, onEventClick }),
    [date, weekDays, weekStartsOn, events, onDateChange, onEventClick],
  )
  return (
    <WeekViewContext.Provider value={value}>
      <div className={cn('flex h-full flex-col', className)} {...props}>
        {children}
      </div>
    </WeekViewContext.Provider>
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
  const { date } = useWeekView()
  return (
    <h1 className={cn('text-base font-semibold text-foreground', className)} {...props}>
      <time dateTime={format(date, 'yyyy-MM')}>{format(date, 'MMMM yyyy')}</time>
    </h1>
  )
}

function Navigation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { date, onDateChange } = useWeekView()
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
        onClick={() => onDateChange?.(addDays(date, -7))}
        className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-muted-foreground hover:text-foreground md:w-9 md:pr-0 md:hover:bg-accent"
      >
        <span className="sr-only">Previous week</span>
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
        onClick={() => onDateChange?.(addDays(date, 7))}
        className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-muted-foreground hover:text-foreground md:w-9 md:pl-0 md:hover:bg-accent"
      >
        <span className="sr-only">Next week</span>
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
      {/* Mobile horizontal-scroll: force inner width wider than viewport on tablet sizes. */}
      <div className="flex max-w-full flex-none flex-col sm:w-[165%] sm:max-w-none md:w-full md:max-w-full">
        {children}
      </div>
    </div>
  )
}

function DayLabels({ className }: { className?: string }) {
  const { weekDays } = useWeekView()
  return (
    <div
      className={cn(
        'sticky top-0 z-30 flex-none bg-background shadow-sm ring-1 ring-border sm:pr-8',
        className,
      )}
    >
      <div className="-mr-px hidden grid-cols-7 divide-x divide-border border-r text-sm/6 text-muted-foreground sm:grid">
        <div className="col-end-1 w-14" />
        {weekDays.map((day) => {
          const today = isToday(day)
          return (
            <div key={day.toISOString()} className="flex items-center justify-center py-3">
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

/**
 * Grid + events combined: they have to share the same CSS grid container so
 * events position correctly relative to the time rows / day columns.
 */
function Grid({
  children,
  className,
}: {
  className?: string
  children?: (event: CalendarEvent) => React.ReactNode
}) {
  const { date, weekDays } = useWeekView()
  const hours = React.useMemo(() => eachHourOfDay(date), [date])

  return (
    <div className={cn('flex flex-auto', className)}>
      <div className="sticky left-0 z-10 w-14 flex-none bg-background ring-1 ring-border" />
      <div className="grid flex-auto grid-cols-1 grid-rows-1">
        {/* Horizontal hour lines */}
        <div
          style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
          className="col-start-1 col-end-2 row-start-1 grid divide-y divide-border"
        >
          <div className="row-end-1 h-7" />
          {hours.map((hour) => (
            <React.Fragment key={hour.getHours()}>
              <div>
                <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs/5 text-muted-foreground">
                  {formatHour(hour)}
                </div>
              </div>
              <div />
            </React.Fragment>
          ))}
        </div>

        {/* Vertical day-column lines */}
        <div className="col-start-1 col-end-2 row-start-1 hidden grid-rows-1 divide-x divide-border sm:grid sm:grid-cols-7">
          {weekDays.map((day, i) => (
            <div
              key={day.toISOString()}
              style={{ gridColumnStart: i + 1 }}
              className="row-span-full"
            />
          ))}
          <div style={{ gridColumnStart: 8 }} className="row-span-full w-8" />
        </div>

        <Events>{children}</Events>
      </div>
    </div>
  )
}

interface EventsProps {
  children?: (event: CalendarEvent) => React.ReactNode
}

function Events({ children }: EventsProps) {
  const { events, weekDays, onEventClick } = useWeekView()
  return (
    <ol
      style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
      className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
    >
      {events.map((event) => {
        const dayIndex = weekDays.findIndex((d) => isSameDay(d, event.start))
        if (dayIndex === -1) return null
        // Each grid row is a 5-minute slice; row 1 is the 1.75rem header offset,
        // so the first time slot (00:00) starts at row 2.
        const startMinutes = event.start.getHours() * 60 + event.start.getMinutes()
        const durationMinutes = Math.max(5, (event.end.getTime() - event.start.getTime()) / 60000)
        const rowStart = Math.floor(startMinutes / 5) + 2
        const rowSpan = Math.ceil(durationMinutes / 5)
        return (
          <li
            key={event.id}
            style={{
              gridRow: `${rowStart} / span ${rowSpan}`,
              gridColumnStart: dayIndex + 1,
            }}
            // The before pseudo provides an opaque mask under translucent event
            // chips in dark mode, so per-event colors keep their intended weight.
            className="relative mt-px flex dark:before:pointer-events-none dark:before:absolute dark:before:inset-1 dark:before:z-0 dark:before:rounded-lg dark:before:bg-background"
          >
            {children ? (
              children(event)
            ) : (
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
            )}
          </li>
        )
      })}
    </ol>
  )
}

export const WeekView = Object.assign(WeekViewRoot, {
  Header,
  Title,
  Navigation,
  Body,
  DayLabels,
  Grid,
  Events,
})
