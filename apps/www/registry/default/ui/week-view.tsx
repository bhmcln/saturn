'use client'

import { format, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { useEventDrag } from '@/registry/default/hooks/use-event-drag'
import { type WeekStartsOn, addDays, formatTime, getWeekDays } from '@/registry/default/lib/time'
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

interface WeekViewContextValue {
  date: Date
  weekDays: Date[]
  weekStartsOn: WeekStartsOn
  events: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventMove?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
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
  /**
   * Fired when the user drags an event to a new position. The hook handles
   * snapping (15 min default). Set to enable drag-to-reschedule.
   */
  onEventMove?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
}

function WeekViewRoot({
  date,
  events = [],
  weekStartsOn = 0,
  onDateChange,
  onEventClick,
  onEventMove,
  className,
  children,
  ...props
}: WeekViewProps) {
  const weekDays = React.useMemo(() => getWeekDays(date, { weekStartsOn }), [date, weekStartsOn])
  const value = React.useMemo<WeekViewContextValue>(
    () => ({ date, weekDays, weekStartsOn, events, onDateChange, onEventClick, onEventMove }),
    [date, weekDays, weekStartsOn, events, onDateChange, onEventClick, onEventMove],
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
  return <DayLabelsPrimitive days={weekDays} className={className} />
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
  const { events, weekDays } = useWeekView()
  const olRef = React.useRef<HTMLOListElement>(null)
  return (
    <ol
      ref={olRef}
      style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
      className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
    >
      {events.map((event) => {
        const dayIndex = weekDays.findIndex((d) => isSameDay(d, event.start))
        if (dayIndex === -1) return null
        return (
          <EventItem
            key={event.id}
            event={event}
            dayIndex={dayIndex}
            dayCount={weekDays.length}
            containerRef={olRef}
            renderItem={children}
          />
        )
      })}
    </ol>
  )
}

interface EventItemProps {
  event: CalendarEvent
  dayIndex: number
  dayCount: number
  containerRef: React.RefObject<HTMLOListElement | null>
  renderItem?: (event: CalendarEvent) => React.ReactNode
}

const HEADER_OFFSET_PX = 28 // 1.75rem
const MS_PER_DAY = 86_400_000

function EventItem({ event, dayIndex, dayCount, containerRef, renderItem }: EventItemProps) {
  const { onEventClick, onEventMove } = useWeekView()
  const [dragMs, setDragMs] = React.useState(0)
  const justDraggedAt = React.useRef(0)

  const { isDragging, handlers } = useEventDrag({
    disabled: !onEventMove,
    snapMinutes: 15,
    getDelta(dx, dy) {
      const el = containerRef.current
      if (!el) return 0
      const rect = el.getBoundingClientRect()
      const timeHeight = rect.height - HEADER_OFFSET_PX
      if (timeHeight <= 0) return 0
      const msPerPx = (24 * 60 * 60 * 1000) / timeHeight
      const dayPx = rect.width / dayCount
      const dayDelta = dayPx > 0 ? Math.round(dx / dayPx) : 0
      return dy * msPerPx + dayDelta * MS_PER_DAY
    },
    onDrag: setDragMs,
    onMove(delta) {
      setDragMs(0)
      justDraggedAt.current = Date.now()
      if (!onEventMove) return
      const newStart = new Date(event.start.getTime() + delta)
      const newEnd = new Date(event.end.getTime() + delta)
      onEventMove(event, newStart, newEnd)
    },
  })

  const renderedStart = new Date(event.start.getTime() + dragMs)
  const renderedEnd = new Date(event.end.getTime() + dragMs)
  const startMinutes = renderedStart.getHours() * 60 + renderedStart.getMinutes()
  const durationMinutes = Math.max(5, (renderedEnd.getTime() - renderedStart.getTime()) / 60000)
  const rowStart = Math.floor(startMinutes / 5) + 2
  const rowSpan = Math.ceil(durationMinutes / 5)
  const dayDelta = Math.floor(dragMs / MS_PER_DAY)
  const renderedDay = Math.max(0, Math.min(dayCount - 1, dayIndex + dayDelta))

  const handleClick = () => {
    // Suppress click if a drag just completed.
    if (Date.now() - justDraggedAt.current < 200) return
    onEventClick?.(event)
  }

  return (
    <li
      style={{
        gridRow: `${rowStart} / span ${rowSpan}`,
        gridColumnStart: renderedDay + 1,
      }}
      className={cn(
        'relative mt-px flex dark:before:pointer-events-none dark:before:absolute dark:before:inset-1 dark:before:z-0 dark:before:rounded-lg dark:before:bg-background',
        isDragging && 'z-30',
      )}
    >
      {renderItem ? (
        renderItem(event)
      ) : (
        <Tooltip open={isDragging ? false : undefined}>
          <TooltipTrigger asChild>
            <EventCard
              color={event.color ?? 'gray'}
              className={cn(
                'absolute inset-1 touch-none select-none',
                onEventMove ? 'cursor-grab' : 'cursor-pointer',
                isDragging && 'cursor-grabbing shadow-lg ring-2 ring-primary/60',
              )}
              onClick={handleClick}
              {...handlers}
            >
              <EventCard.Title>{event.title}</EventCard.Title>
              <EventCard.Time>
                <time dateTime={renderedStart.toISOString()}>{formatTime(renderedStart)}</time>
              </EventCard.Time>
            </EventCard>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="font-semibold">{event.title}</p>
            <p className="opacity-80">
              {formatTime(renderedStart)} – {formatTime(renderedEnd)}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </li>
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
