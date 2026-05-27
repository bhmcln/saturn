'use client'

import { format, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { useDragAutoscroll } from '@/registry/default/hooks/use-drag-autoscroll'
import { useDragToCreate } from '@/registry/default/hooks/use-drag-to-create'
import { useEventDrag } from '@/registry/default/hooks/use-event-drag'
import { useEventResize } from '@/registry/default/hooks/use-event-resize'
import { useInitialTimeScroll } from '@/registry/default/hooks/use-initial-time-scroll'
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
  onEventMove?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  onEventCreate?: (start: Date, end: Date) => void
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
  onEventMove?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  onEventCreate?: (start: Date, end: Date) => void
}

function MultiDayViewRoot({
  date,
  days = 3,
  events = [],
  onDateChange,
  onEventClick,
  onEventMove,
  onEventResize,
  onEventCreate,
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
      onEventMove,
      onEventResize,
      onEventCreate,
    }),
    [
      date,
      dayList,
      days,
      events,
      onDateChange,
      onEventClick,
      onEventMove,
      onEventResize,
      onEventCreate,
    ],
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

const HEADER_OFFSET_PX = 28 // 1.75rem
const MS_PER_DAY = 86_400_000

function Grid({ className }: { className?: string }) {
  const { date, days, dayCount, events, onEventCreate } = useMultiDayView()
  const colsTemplate = `repeat(${dayCount}, minmax(0, 1fr))`
  const olRef = React.useRef<HTMLOListElement>(null)

  useInitialTimeScroll({
    ref: olRef,
    targetMinutes: earliestEventMinutes(events) ?? 8 * 60,
  })

  const pointToDate = (point: { x: number; y: number }): Date => {
    const ol = olRef.current
    if (!ol) return new Date()
    const rect = ol.getBoundingClientRect()
    const dayWidth = rect.width / dayCount
    const dayIdx = Math.min(dayCount - 1, Math.max(0, Math.floor(point.x / dayWidth)))
    const day = days[dayIdx] ?? days[0]
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
          ref={olRef}
          style={{
            gridTemplateColumns: colsTemplate,
            gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
          }}
          className={cn(
            'col-start-1 col-end-2 row-start-1 grid',
            onEventCreate && 'cursor-crosshair',
          )}
          {...handlers}
        >
          {events.map((event) => {
            const dayIndex = days.findIndex((d) => isSameDay(d, event.start))
            if (dayIndex === -1) return null
            return (
              <MultiDayEventItem
                key={event.id}
                event={event}
                dayIndex={dayIndex}
                dayCount={dayCount}
                containerRef={olRef}
              />
            )
          })}
          {preview && <MultiDayCreatePreview start={preview.start} end={preview.end} days={days} />}
        </ol>
      </div>
    </div>
  )
}

interface MultiDayEventItemProps {
  event: CalendarEvent
  dayIndex: number
  dayCount: number
  containerRef: React.RefObject<HTMLOListElement | null>
}

function MultiDayEventItem({ event, dayIndex, dayCount, containerRef }: MultiDayEventItemProps) {
  const { onEventClick, onEventMove, onEventResize } = useMultiDayView()
  const [dragMs, setDragMs] = React.useState(0)
  const [resizeTopMs, setResizeTopMs] = React.useState(0)
  const [resizeBottomMs, setResizeBottomMs] = React.useState(0)
  const justDraggedAt = React.useRef(0)

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
      onEventMove(
        event,
        new Date(event.start.getTime() + delta),
        new Date(event.end.getTime() + delta),
      )
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
    if (Date.now() - justDraggedAt.current < 200) return
    onEventClick?.(event)
  }

  const stopAndStart =
    (h: (event: React.PointerEvent<HTMLElement>) => void) =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation()
      h(event)
    }

  const showStartSnap = isDragging || resizeTop.isResizing
  const showEndSnap = resizeBottom.isResizing
  const liRef = React.useRef<HTMLLIElement>(null)
  useDragAutoscroll({ isActive: isInteracting, ref: liRef })

  return (
    <>
      <li
        ref={liRef}
        style={{
          gridRow: `${rowStart} / span ${rowSpan}`,
          gridColumnStart: renderedDay + 1,
        }}
        className={cn(
          'relative mt-px flex dark:before:pointer-events-none dark:before:absolute dark:before:inset-1 dark:before:z-0 dark:before:rounded-lg dark:before:bg-background',
          isInteracting && 'z-30',
        )}
      >
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
                    className="absolute top-0 right-0 left-0 h-2 cursor-ns-resize touch-none"
                    aria-label="Resize event start"
                  >
                    <div className="absolute top-1/2 left-1/2 h-0.5 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-0 transition-opacity group-hover/event:opacity-50" />
                  </div>
                  <div
                    onPointerDown={stopAndStart(resizeBottom.handlers.onPointerDown)}
                    className="absolute right-0 bottom-0 left-0 h-2 cursor-ns-resize touch-none"
                    aria-label="Resize event end"
                  >
                    <div className="absolute top-1/2 left-1/2 h-0.5 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-0 transition-opacity group-hover/event:opacity-50" />
                  </div>
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
      </li>
      {showStartSnap && <MultiDaySnapLine time={renderedStart} dayCount={dayCount} />}
      {showEndSnap && <MultiDaySnapLine time={renderedEnd} dayCount={dayCount} />}
    </>
  )
}

function earliestEventMinutes(events: CalendarEvent[]): number | undefined {
  if (events.length === 0) return undefined
  let earliest = Number.POSITIVE_INFINITY
  for (const e of events) {
    const m = e.start.getHours() * 60 + e.start.getMinutes()
    if (m < earliest) earliest = m
  }
  if (!Number.isFinite(earliest)) return undefined
  return Math.max(0, earliest - 30)
}

function MultiDaySnapLine({ time, dayCount }: { time: Date; dayCount: number }) {
  const minutes = time.getHours() * 60 + time.getMinutes()
  const row = Math.floor(minutes / 5) + 2
  return (
    <li
      style={{ gridRow: `${row} / span 1`, gridColumn: `1 / span ${dayCount}` }}
      className="pointer-events-none relative z-40"
    >
      <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-primary" />
      <div className="absolute top-0 -left-14 -translate-y-1/2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold tabular-nums whitespace-nowrap text-primary-foreground">
        {formatTime(time)}
      </div>
    </li>
  )
}

function MultiDayCreatePreview({
  start,
  end,
  days,
}: {
  start: Date
  end: Date
  days: Date[]
}) {
  const dayIndex = days.findIndex((d) => isSameDay(d, start))
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
        {formatTime(start)} – {formatTime(end)}
      </div>
    </li>
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
