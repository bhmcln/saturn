'use client'

import { format, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { useDragToCreate } from '@/registry/default/hooks/use-drag-to-create'
import { useEventDrag } from '@/registry/default/hooks/use-event-drag'
import { useEventResize } from '@/registry/default/hooks/use-event-resize'
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
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  onEventCreate?: (start: Date, end: Date) => void
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
  /**
   * Fired when the user resizes an event by dragging its top or bottom edge.
   * Set to enable resize handles.
   */
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  /**
   * Fired when the user drags across empty grid to create a new event.
   * Set to enable drag-to-create.
   */
  onEventCreate?: (start: Date, end: Date) => void
}

function WeekViewRoot({
  date,
  events = [],
  weekStartsOn = 0,
  onDateChange,
  onEventClick,
  onEventMove,
  onEventResize,
  onEventCreate,
  className,
  children,
  ...props
}: WeekViewProps) {
  const weekDays = React.useMemo(() => getWeekDays(date, { weekStartsOn }), [date, weekStartsOn])
  const value = React.useMemo<WeekViewContextValue>(
    () => ({
      date,
      weekDays,
      weekStartsOn,
      events,
      onDateChange,
      onEventClick,
      onEventMove,
      onEventResize,
      onEventCreate,
    }),
    [
      date,
      weekDays,
      weekStartsOn,
      events,
      onDateChange,
      onEventClick,
      onEventMove,
      onEventResize,
      onEventCreate,
    ],
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
  const { events, weekDays, onEventCreate } = useWeekView()
  const olRef = React.useRef<HTMLOListElement>(null)

  const pointToDate = (point: { x: number; y: number }): Date => {
    const ol = olRef.current
    if (!ol) return new Date()
    const rect = ol.getBoundingClientRect()
    const dayWidth = rect.width / weekDays.length
    const dayIdx = Math.min(
      weekDays.length - 1,
      Math.max(0, Math.floor(point.x / dayWidth)),
    )
    const day = weekDays[dayIdx] ?? weekDays[0]
    if (!day) return new Date()
    const timeHeight = rect.height - HEADER_OFFSET_PX
    const adjustedY = Math.max(0, point.y - HEADER_OFFSET_PX)
    const minutesIntoDay = timeHeight > 0 ? (adjustedY / timeHeight) * 24 * 60 : 0
    const d = new Date(day)
    d.setHours(0, 0, 0, 0)
    d.setMinutes(minutesIntoDay)
    return d
  }

  const { preview, handlers } = useDragToCreate({
    disabled: !onEventCreate,
    snapMinutes: 15,
    pointToDate,
    onCreate(start, end) {
      onEventCreate?.(start, end)
    },
  })

  return (
    <ol
      ref={olRef}
      style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
      className={cn(
        'col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8',
        onEventCreate && 'cursor-crosshair',
      )}
      {...handlers}
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
      {preview && <CreatePreview start={preview.start} end={preview.end} weekDays={weekDays} />}
    </ol>
  )
}

function CreatePreview({
  start,
  end,
  weekDays,
}: {
  start: Date
  end: Date
  weekDays: Date[]
}) {
  const dayIndex = weekDays.findIndex((d) => isSameDay(d, start))
  if (dayIndex === -1) return null
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const durationMinutes = Math.max(5, (end.getTime() - start.getTime()) / 60000)
  const rowStart = Math.floor(startMinutes / 5) + 2
  const rowSpan = Math.ceil(durationMinutes / 5)
  return (
    <li
      style={{
        gridRow: `${rowStart} / span ${rowSpan}`,
        gridColumnStart: dayIndex + 1,
      }}
      className="pointer-events-none relative mt-px flex"
    >
      <div className="absolute inset-1 rounded-lg border-2 border-primary bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">
        <span>
          {formatTime(start)} – {formatTime(end)}
        </span>
      </div>
    </li>
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
  const { onEventClick, onEventMove, onEventResize } = useWeekView()
  const [dragMs, setDragMs] = React.useState(0)
  const [resizeTopMs, setResizeTopMs] = React.useState(0)
  const [resizeBottomMs, setResizeBottomMs] = React.useState(0)
  const justDraggedAt = React.useRef(0)

  /** Vertical px → ms for this view's geometry. */
  const verticalMsPerPx = (): number => {
    const el = containerRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const timeHeight = rect.height - HEADER_OFFSET_PX
    if (timeHeight <= 0) return 0
    return (24 * 60 * 60 * 1000) / timeHeight
  }

  const { isDragging, handlers } = useEventDrag({
    disabled: !onEventMove,
    snapMinutes: 15,
    getDelta(dx, dy) {
      const ms = verticalMsPerPx()
      if (ms === 0) return 0
      const el = containerRef.current
      if (!el) return 0
      const dayPx = el.getBoundingClientRect().width / dayCount
      const dayDelta = dayPx > 0 ? Math.round(dx / dayPx) : 0
      return dy * ms + dayDelta * MS_PER_DAY
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

  const resizeTop = useEventResize({
    edge: 'top',
    disabled: !onEventResize,
    snapMinutes: 15,
    getDelta: (_dx, dy) => dy * verticalMsPerPx(),
    onDragging: setResizeTopMs,
    onResize(delta) {
      setResizeTopMs(0)
      justDraggedAt.current = Date.now()
      if (!onEventResize) return
      const newStart = new Date(event.start.getTime() + delta)
      if (newStart >= event.end) return
      onEventResize(event, newStart, event.end)
    },
  })

  const resizeBottom = useEventResize({
    edge: 'bottom',
    disabled: !onEventResize,
    snapMinutes: 15,
    getDelta: (_dx, dy) => dy * verticalMsPerPx(),
    onDragging: setResizeBottomMs,
    onResize(delta) {
      setResizeBottomMs(0)
      justDraggedAt.current = Date.now()
      if (!onEventResize) return
      const newEnd = new Date(event.end.getTime() + delta)
      if (newEnd <= event.start) return
      onEventResize(event, event.start, newEnd)
    },
  })

  const renderedStart = new Date(event.start.getTime() + dragMs + resizeTopMs)
  const renderedEnd = new Date(event.end.getTime() + dragMs + resizeBottomMs)
  const startMinutes = renderedStart.getHours() * 60 + renderedStart.getMinutes()
  const durationMinutes = Math.max(5, (renderedEnd.getTime() - renderedStart.getTime()) / 60000)
  const rowStart = Math.floor(startMinutes / 5) + 2
  const rowSpan = Math.ceil(durationMinutes / 5)
  const dayDelta = Math.floor(dragMs / MS_PER_DAY)
  const renderedDay = Math.max(0, Math.min(dayCount - 1, dayIndex + dayDelta))
  const isInteracting = isDragging || resizeTop.isResizing || resizeBottom.isResizing

  const handleClick = () => {
    // Suppress click if a drag/resize just completed.
    if (Date.now() - justDraggedAt.current < 200) return
    onEventClick?.(event)
  }

  const stopAndStart =
    (h: (event: React.PointerEvent<HTMLElement>) => void) =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation()
      h(event)
    }

  return (
    <li
      style={{
        gridRow: `${rowStart} / span ${rowSpan}`,
        gridColumnStart: renderedDay + 1,
      }}
      className={cn(
        'relative mt-px flex dark:before:pointer-events-none dark:before:absolute dark:before:inset-1 dark:before:z-0 dark:before:rounded-lg dark:before:bg-background',
        isInteracting && 'z-30',
      )}
    >
      {renderItem ? (
        renderItem(event)
      ) : (
        <Tooltip open={isInteracting ? false : undefined}>
          <TooltipTrigger asChild>
            <EventCard
              color={event.color ?? 'gray'}
              className={cn(
                'group/event absolute inset-1 touch-none select-none',
                onEventMove ? 'cursor-grab' : 'cursor-pointer',
                isInteracting && 'cursor-grabbing shadow-lg ring-2 ring-primary/60',
              )}
              onClick={handleClick}
              {...handlers}
            >
              <EventCard.Title>{event.title}</EventCard.Title>
              <EventCard.Time>
                <time dateTime={renderedStart.toISOString()}>{formatTime(renderedStart)}</time>
              </EventCard.Time>
              {onEventResize && (
                <>
                  <div
                    onPointerDown={stopAndStart(resizeTop.handlers.onPointerDown)}
                    className="absolute top-0 right-0 left-0 h-1.5 cursor-ns-resize touch-none opacity-0 transition-opacity group-hover/event:opacity-100"
                    aria-label="Resize event start"
                  />
                  <div
                    onPointerDown={stopAndStart(resizeBottom.handlers.onPointerDown)}
                    className="absolute right-0 bottom-0 left-0 h-1.5 cursor-ns-resize touch-none opacity-0 transition-opacity group-hover/event:opacity-100"
                    aria-label="Resize event end"
                  />
                </>
              )}
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
