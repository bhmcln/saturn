'use client'

import { format, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { useDragAutoscroll } from '@/registry/default/hooks/use-drag-autoscroll'
import { useDragToCreate } from '@/registry/default/hooks/use-drag-to-create'
import { useEventDrag } from '@/registry/default/hooks/use-event-drag'
import { useEventLayout } from '@/registry/default/hooks/use-event-layout'
import { useEventResize } from '@/registry/default/hooks/use-event-resize'
import { useInitialTimeScroll } from '@/registry/default/hooks/use-initial-time-scroll'
import { useNow } from '@/registry/default/hooks/use-now'
import { addDays, formatTime } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'
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

interface DayViewContextValue {
  date: Date
  dayEvents: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventMove?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  onEventCreate?: (start: Date, end: Date) => void
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
  /** Enable drag-to-reschedule. */
  onEventMove?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  /** Enable resize handles on event chips. */
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  /** Enable drag-on-empty-grid to create a new event. */
  onEventCreate?: (start: Date, end: Date) => void
}

function DayViewRoot({
  date,
  events = [],
  onDateChange,
  onEventClick,
  onEventMove,
  onEventResize,
  onEventCreate,
  className,
  children,
  ...props
}: DayViewProps) {
  const dayEvents = React.useMemo(
    () => events.filter((e) => isSameDay(e.start, date)),
    [events, date],
  )
  const value = React.useMemo<DayViewContextValue>(
    () => ({
      date,
      dayEvents,
      onDateChange,
      onEventClick,
      onEventMove,
      onEventResize,
      onEventCreate,
    }),
    [date, dayEvents, onDateChange, onEventClick, onEventMove, onEventResize, onEventCreate],
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

const HEADER_OFFSET_PX = 28 // 1.75rem

function Grid({ className }: { className?: string }) {
  const { date, dayEvents, onEventCreate } = useDayView()
  const layout = useEventLayout(dayEvents)
  const showsToday = isToday(date)
  const olRef = React.useRef<HTMLOListElement>(null)

  useInitialTimeScroll({
    ref: olRef,
    targetMinutes: earliestEventMinutes(dayEvents) ?? 8 * 60,
  })

  const pointToDate = (point: { x: number; y: number }): Date => {
    const ol = olRef.current
    if (!ol) return date
    const rect = ol.getBoundingClientRect()
    const timeHeight = rect.height - HEADER_OFFSET_PX
    const adjustedY = Math.max(0, point.y - HEADER_OFFSET_PX)
    const minutesIntoDay = timeHeight > 0 ? (adjustedY / timeHeight) * 24 * 60 : 0
    const d = new Date(date)
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

        {/* Events + now-line */}
        <ol
          ref={olRef}
          style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
          className={cn(
            'col-start-1 col-end-2 row-start-1 grid grid-cols-1',
            onEventCreate && 'cursor-crosshair',
          )}
          {...handlers}
        >
          {layout.map(({ event, leftPct, widthPct }) => (
            <DayEventItem
              key={event.id}
              event={event}
              leftPct={leftPct}
              widthPct={widthPct}
              containerRef={olRef}
            />
          ))}
          {preview && <DayCreatePreview start={preview.start} end={preview.end} />}
          {showsToday && <NowLine />}
        </ol>
      </div>
    </div>
  )
}

interface DayEventItemProps {
  event: CalendarEvent
  leftPct: number
  widthPct: number
  containerRef: React.RefObject<HTMLOListElement | null>
}

function DayEventItem({ event, leftPct, widthPct, containerRef }: DayEventItemProps) {
  const { onEventClick, onEventMove, onEventResize } = useDayView()
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
    getDelta: (_dx, dy) => dy * verticalMsPerPx(),
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
  useDragAutoscroll({ isActive: isInteracting, ref: liRef, disableX: true })

  return (
    <>
      <li
        ref={liRef}
        style={{ gridRow: `${rowStart} / span ${rowSpan}` }}
        className={cn('relative mt-px flex', isInteracting && 'z-30')}
      >
        <Tooltip open={isInteracting ? false : undefined}>
          <TooltipTrigger asChild>
            <EventCard
              color={event.color ?? 'gray'}
              onClick={handleClick}
              style={{
                left: `calc(${leftPct}% + 0.25rem)`,
                width: `calc(${widthPct}% - 0.5rem)`,
              }}
              className={cn(
                'group/event absolute top-1 bottom-1 touch-none select-none',
                onEventMove ? 'cursor-grab' : 'cursor-pointer',
                isInteracting && 'cursor-grabbing shadow-lg ring-2 ring-primary/60',
              )}
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
          <TooltipContent side="right">
            <p className="font-semibold">{event.title}</p>
            <p className="opacity-80">
              {formatTime(renderedStart)} – {formatTime(renderedEnd)}
            </p>
          </TooltipContent>
        </Tooltip>
      </li>
      {showStartSnap && <SnapLine time={renderedStart} />}
      {showEndSnap && <SnapLine time={renderedEnd} />}
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

function SnapLine({ time }: { time: Date }) {
  const minutes = time.getHours() * 60 + time.getMinutes()
  const row = Math.floor(minutes / 5) + 2
  return (
    <li
      style={{ gridRow: `${row} / span 1` }}
      className="pointer-events-none relative z-40 col-start-1"
    >
      <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-primary" />
      <div className="absolute top-0 -left-14 -translate-y-1/2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold tabular-nums whitespace-nowrap text-primary-foreground">
        {formatTime(time)}
      </div>
    </li>
  )
}

function DayCreatePreview({ start, end }: { start: Date; end: Date }) {
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const durationMinutes = Math.max(5, (end.getTime() - start.getTime()) / 60000)
  const rowStart = Math.floor(startMinutes / 5) + 2
  const rowSpan = Math.ceil(durationMinutes / 5)
  return (
    <li
      style={{ gridRow: `${rowStart} / span ${rowSpan}` }}
      className="pointer-events-none relative mt-px flex"
    >
      <div className="absolute inset-1 rounded-lg border-2 border-primary bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">
        {formatTime(start)} – {formatTime(end)}
      </div>
    </li>
  )
}

export const DayView = Object.assign(DayViewRoot, {
  Header,
  Title,
  Navigation,
  Body,
  Grid,
})
