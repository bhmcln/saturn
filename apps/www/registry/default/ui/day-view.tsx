'use client'

import { format, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { useEventLayout } from '@/registry/default/hooks/use-event-layout'
import { useNow } from '@/registry/default/hooks/use-now'
import { addDays, eachHourOfDay, formatHour, formatTime } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'
import { EventCard, type EventColor } from '@/registry/default/ui/event-card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color?: EventColor
  meta?: Record<string, unknown>
}

interface DayViewContextValue {
  date: Date
  dayEvents: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

const DayViewContext = React.createContext<DayViewContextValue | null>(null)

function useDayView() {
  const ctx = React.useContext(DayViewContext)
  if (!ctx) {
    throw new Error('DayView.* subcomponents must be rendered inside <DayView>')
  }
  return ctx
}

export interface DayViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  date: Date
  events?: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

function DayViewRoot({
  date,
  events = [],
  onDateChange,
  onEventClick,
  className,
  children,
  ...props
}: DayViewProps) {
  const dayEvents = React.useMemo(
    () => events.filter((e) => isSameDay(e.start, date)),
    [events, date],
  )
  const value = React.useMemo<DayViewContextValue>(
    () => ({ date, dayEvents, onDateChange, onEventClick }),
    [date, dayEvents, onDateChange, onEventClick],
  )
  return (
    <DayViewContext.Provider value={value}>
      <div className={cn('flex h-full flex-col', className)} {...props}>
        {children}
      </div>
    </DayViewContext.Provider>
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
  const { date } = useDayView()
  return (
    <h1 className={cn('text-base font-semibold text-foreground', className)} {...props}>
      <time dateTime={format(date, 'yyyy-MM-dd')}>
        <span className="sm:hidden">{format(date, 'MMM d, yyyy')}</span>
        <span className="hidden sm:inline">{format(date, 'EEEE, MMMM d, yyyy')}</span>
      </time>
    </h1>
  )
}

function Navigation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { date, onDateChange } = useDayView()
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
        onClick={() => onDateChange?.(addDays(date, -1))}
        className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-muted-foreground hover:text-foreground md:w-9 md:pr-0 md:hover:bg-accent"
      >
        <span className="sr-only">Previous day</span>
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
        onClick={() => onDateChange?.(addDays(date, 1))}
        className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-muted-foreground hover:text-foreground md:w-9 md:pl-0 md:hover:bg-accent"
      >
        <span className="sr-only">Next day</span>
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

function NowLine() {
  const now = useNow()
  const minutes = now.getHours() * 60 + now.getMinutes()
  const row = Math.floor(minutes / 5) + 2
  return (
    <li
      style={{ gridRow: `${row} / span 1` }}
      className="pointer-events-none relative z-10 col-start-1"
    >
      <div className="absolute inset-x-0 top-0 -translate-y-1/2 flex items-center">
        <div className="-ml-1 size-2 rounded-full bg-red-500" />
        <div className="h-[1.5px] flex-auto bg-red-500" />
      </div>
    </li>
  )
}

function Grid({ className }: { className?: string }) {
  const { date, dayEvents, onEventClick } = useDayView()
  const hours = React.useMemo(() => eachHourOfDay(date), [date])
  const layout = useEventLayout(dayEvents)
  const showsToday = isToday(date)

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

        {/* Events + now-line */}
        <ol
          style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
          className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
        >
          {layout.map(({ event, leftPct, widthPct }) => {
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
                style={{ gridRow: `${rowStart} / span ${rowSpan}` }}
                className="relative mt-px flex"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <EventCard
                      color={event.color ?? 'gray'}
                      onClick={() => onEventClick?.(event)}
                      style={{
                        left: `calc(${leftPct}% + 0.25rem)`,
                        width: `calc(${widthPct}% - 0.5rem)`,
                      }}
                      className="absolute top-1 bottom-1 cursor-pointer"
                    >
                      <EventCard.Title>{event.title}</EventCard.Title>
                      <EventCard.Time>
                        <time dateTime={event.start.toISOString()}>{formatTime(event.start)}</time>
                      </EventCard.Time>
                    </EventCard>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="font-semibold">{event.title}</p>
                    <p className="opacity-80">
                      {formatTime(event.start)} – {formatTime(event.end)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </li>
            )
          })}
          {showsToday && <NowLine />}
        </ol>
      </div>
    </div>
  )
}

export const DayView = Object.assign(DayViewRoot, {
  Header,
  Title,
  Navigation,
  Body,
  Grid,
})
