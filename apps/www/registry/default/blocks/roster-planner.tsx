'use client'

import { format, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { useEventResize } from '@/registry/default/hooks/use-event-resize'
import { type WeekStartsOn, addDays, getWeekDays } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'
import { DayLabels } from '@/registry/default/ui/day-labels'
import { ShiftBlock, type ShiftSegment } from '@/registry/default/ui/shift-block'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip'
import { UnallocatedRow } from '@/registry/default/ui/unallocated-row'

export interface RosterWorker {
  id: string
  name: string
  initials?: string
  avatar?: React.ReactNode
  /** Optional secondary line under the name (role, hours, stats). */
  meta?: React.ReactNode
}

export interface RosterShift {
  id: string
  workerId: string
  start: Date
  end: Date
  /**
   * Activity segments for the shift's left-edge accent bar. Optional —
   * shift renders as a plain pill if omitted.
   */
  activities?: ShiftSegment[]
  /** Title rendered inside the shift block. Defaults to the formatted start time. */
  title?: string
  /** Optional second line (e.g. "5 visits · 7h 30m"). */
  meta?: string
}

export interface RosterUnallocatedTask {
  id: string
  day: Date
  title: string
}

export interface RosterPlannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Any date within the visible week; the rest is computed via weekStartsOn. */
  weekStart: Date
  weekStartsOn?: WeekStartsOn
  workers: RosterWorker[]
  shifts: RosterShift[]
  unallocated?: RosterUnallocatedTask[]
  /** [startHour, endHour] for the per-cell vertical time scale. Default [6, 22] (6 AM – 10 PM). */
  cellTimeRange?: [number, number]
  /** Width of the sticky-left worker label column. */
  labelWidth?: string
  onWeekChange?: (date: Date) => void
  onShiftClick?: (shift: RosterShift) => void
  onTaskClick?: (task: RosterUnallocatedTask) => void
  /**
   * Called when a shift is dragged to a new position. The target carries the
   * new worker (may be the same), and the new start + end. Pass to enable
   * drag — supports vertical (time), horizontal (day), and cross-row
   * (worker reassignment) drag in one gesture, all snapped to 15 minutes.
   */
  onShiftMove?: (shift: RosterShift, target: { workerId: string; start: Date; end: Date }) => void
  /**
   * Called when a shift is resized from its top or bottom edge. Pass to enable
   * the resize handles.
   */
  onShiftResize?: (shift: RosterShift, newStart: Date, newEnd: Date) => void
}

export function RosterPlanner({
  weekStart,
  weekStartsOn = 0,
  workers,
  shifts,
  unallocated = [],
  cellTimeRange = [6, 22],
  labelWidth = '14rem',
  onWeekChange,
  onShiftClick,
  onTaskClick,
  onShiftMove,
  onShiftResize,
  className,
  ...props
}: RosterPlannerProps) {
  const weekDays = React.useMemo(
    () => getWeekDays(weekStart, { weekStartsOn }),
    [weekStart, weekStartsOn],
  )

  const shiftsByWorker = React.useMemo(() => {
    const map = new Map<string, RosterShift[]>()
    for (const shift of shifts) {
      const list = map.get(shift.workerId) ?? []
      list.push(shift)
      map.set(shift.workerId, list)
    }
    return map
  }, [shifts])

  const unallocatedByDay = React.useMemo(
    () => weekDays.map((day) => unallocated.filter((t) => isSameDay(t.day, day))),
    [weekDays, unallocated],
  )

  return (
    <div className={cn('flex h-full flex-col bg-background', className)} {...props}>
      <header className="flex flex-none items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-base font-semibold text-foreground">
            <time dateTime={format(weekStart, 'yyyy-MM-dd')}>{format(weekStart, 'MMMM yyyy')}</time>
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            Week of {format(weekStart, 'MMM d')} ·{' '}
            <span className="font-medium text-foreground">{workers.length}</span> workers ·{' '}
            <span className="font-medium text-foreground">{shifts.length}</span> shifts
            {unallocated.length > 0 && (
              <>
                {' · '}
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  {unallocated.length} unallocated
                </span>
              </>
            )}
          </p>
        </div>
        <NavGroup weekStart={weekStart} onWeekChange={onWeekChange} />
      </header>

      <div className="flex flex-auto flex-col overflow-auto">
        <DayLabels days={weekDays} gutterWidth={labelWidth} className="border-b" />
        {workers.map((worker, workerIndex) => (
          <WorkerRow
            key={worker.id}
            worker={worker}
            workerIndex={workerIndex}
            workers={workers}
            shifts={shiftsByWorker.get(worker.id) ?? []}
            days={weekDays}
            cellTimeRange={cellTimeRange}
            labelWidth={labelWidth}
            onShiftClick={onShiftClick}
            onShiftMove={onShiftMove}
            onShiftResize={onShiftResize}
          />
        ))}
        {unallocated.length > 0 && (
          <UnallocatedRow labelWidth={labelWidth} dayCount={weekDays.length}>
            <UnallocatedRow.Label>
              Unallocated
              <span className="ml-1 text-muted-foreground">· {unallocated.length}</span>
            </UnallocatedRow.Label>
            {unallocatedByDay.map((tasks, i) => (
              <UnallocatedRow.Cell key={weekDays[i]?.toISOString() ?? i}>
                {tasks.map((task) => (
                  <UnallocatedRow.Chip key={task.id} onClick={() => onTaskClick?.(task)}>
                    {task.title}
                  </UnallocatedRow.Chip>
                ))}
              </UnallocatedRow.Cell>
            ))}
          </UnallocatedRow>
        )}
      </div>
    </div>
  )
}

function NavGroup({
  weekStart,
  onWeekChange,
}: {
  weekStart: Date
  onWeekChange?: (date: Date) => void
}) {
  return (
    <div className="flex items-center rounded-md border bg-background shadow-xs">
      <button
        type="button"
        onClick={() => onWeekChange?.(addDays(weekStart, -7))}
        className="flex h-9 w-9 items-center justify-center rounded-l-md text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous week</span>
      </button>
      <button
        type="button"
        onClick={() => onWeekChange?.(new Date())}
        className="border-x px-3 text-sm font-semibold text-foreground hover:bg-accent"
      >
        Today
      </button>
      <button
        type="button"
        onClick={() => onWeekChange?.(addDays(weekStart, 7))}
        className="flex h-9 w-9 items-center justify-center rounded-r-md text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next week</span>
      </button>
    </div>
  )
}

interface WorkerRowProps {
  worker: RosterWorker
  workerIndex: number
  workers: RosterWorker[]
  shifts: RosterShift[]
  days: Date[]
  cellTimeRange: [number, number]
  labelWidth: string
  onShiftClick?: (shift: RosterShift) => void
  onShiftMove?: (shift: RosterShift, target: { workerId: string; start: Date; end: Date }) => void
  onShiftResize?: (shift: RosterShift, newStart: Date, newEnd: Date) => void
}

function WorkerRow({
  worker,
  workerIndex,
  workers,
  shifts,
  days,
  cellTimeRange,
  labelWidth,
  onShiftClick,
  onShiftMove,
  onShiftResize,
}: WorkerRowProps) {
  return (
    <div
      className="grid min-h-32 flex-none border-b last:border-b-0"
      style={{ gridTemplateColumns: `${labelWidth} repeat(${days.length}, minmax(0, 1fr))` }}
    >
      <div className="sticky left-0 z-10 flex items-start gap-2 border-r bg-background p-3 text-sm">
        <Avatar worker={worker} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{worker.name}</p>
          {worker.meta && <p className="truncate text-xs text-muted-foreground">{worker.meta}</p>}
        </div>
      </div>
      {days.map((day, dayIndex) => (
        <DayCell
          key={day.toISOString()}
          dayIndex={dayIndex}
          days={days}
          workerIndex={workerIndex}
          workers={workers}
          shifts={shifts.filter((s) => isSameDay(s.start, day))}
          cellTimeRange={cellTimeRange}
          onShiftClick={onShiftClick}
          onShiftMove={onShiftMove}
          onShiftResize={onShiftResize}
        />
      ))}
    </div>
  )
}

function Avatar({ worker }: { worker: RosterWorker }) {
  if (worker.avatar) return <>{worker.avatar}</>
  const initials = worker.initials ?? worker.name.slice(0, 2).toUpperCase()
  return (
    <span className="flex size-8 flex-none items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
      {initials}
    </span>
  )
}

interface DayCellProps {
  dayIndex: number
  days: Date[]
  workerIndex: number
  workers: RosterWorker[]
  shifts: RosterShift[]
  cellTimeRange: [number, number]
  onShiftClick?: (shift: RosterShift) => void
  onShiftMove?: (shift: RosterShift, target: { workerId: string; start: Date; end: Date }) => void
  onShiftResize?: (shift: RosterShift, newStart: Date, newEnd: Date) => void
}

function DayCell({
  dayIndex,
  days,
  workerIndex,
  workers,
  shifts,
  cellTimeRange,
  onShiftClick,
  onShiftMove,
  onShiftResize,
}: DayCellProps) {
  const cellRef = React.useRef<HTMLDivElement>(null)
  return (
    <div ref={cellRef} className="relative border-l first-of-type:border-l-0">
      {shifts.map((shift) => (
        <Shift
          key={shift.id}
          shift={shift}
          cellRef={cellRef}
          cellTimeRange={cellTimeRange}
          workerIndex={workerIndex}
          workers={workers}
          dayIndex={dayIndex}
          days={days}
          onShiftClick={onShiftClick}
          onShiftMove={onShiftMove}
          onShiftResize={onShiftResize}
        />
      ))}
    </div>
  )
}

interface ShiftProps {
  shift: RosterShift
  cellRef: React.RefObject<HTMLDivElement | null>
  cellTimeRange: [number, number]
  workerIndex: number
  workers: RosterWorker[]
  dayIndex: number
  days: Date[]
  onShiftClick?: (shift: RosterShift) => void
  onShiftMove?: (shift: RosterShift, target: { workerId: string; start: Date; end: Date }) => void
  onShiftResize?: (shift: RosterShift, newStart: Date, newEnd: Date) => void
}

interface DragSnap {
  workerDelta: number
  dayDelta: number
  timeMs: number
}

const SNAP_MS = 15 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const DRAG_THRESHOLD_PX = 4

function Shift({
  shift,
  cellRef,
  cellTimeRange,
  workerIndex,
  workers,
  dayIndex,
  days,
  onShiftClick,
  onShiftMove,
  onShiftResize,
}: ShiftProps) {
  const [startHour, endHour] = cellTimeRange
  const cellMinutes = Math.max(1, (endHour - startHour) * 60)

  const timeToPct = React.useCallback(
    (date: Date): number => {
      const minutes = date.getHours() * 60 + date.getMinutes() - startHour * 60
      return (minutes / cellMinutes) * 100
    },
    [startHour, cellMinutes],
  )

  const [drag, setDrag] = React.useState<DragSnap | null>(null)
  const [resizeStartDelta, setResizeStartDelta] = React.useState(0)
  const [resizeEndDelta, setResizeEndDelta] = React.useState(0)

  const dragGeomRef = React.useRef<{
    x: number
    y: number
    cellWidth: number
    cellHeight: number
    msPerPx: number
  } | null>(null)
  const isDraggingRef = React.useRef(false)

  const dyToMs = React.useCallback(
    (dy: number): number => {
      const cell = cellRef.current
      if (!cell) return 0
      const height = cell.getBoundingClientRect().height
      if (height === 0) return 0
      return (dy * cellMinutes * 60 * 1000) / height
    },
    [cellRef, cellMinutes],
  )

  const computeSnap = React.useCallback(
    (clientX: number, clientY: number): DragSnap | null => {
      const geom = dragGeomRef.current
      if (!geom) return null
      const dx = clientX - geom.x
      const dy = clientY - geom.y

      const workerDeltaRaw = Math.round(dy / geom.cellHeight)
      const workerDelta = Math.max(
        -workerIndex,
        Math.min(workers.length - 1 - workerIndex, workerDeltaRaw),
      )
      const remainingDy = dy - workerDelta * geom.cellHeight
      const timeMs = Math.round((remainingDy * geom.msPerPx) / SNAP_MS) * SNAP_MS

      const dayDeltaRaw = Math.round(dx / geom.cellWidth)
      const dayDelta = Math.max(-dayIndex, Math.min(days.length - 1 - dayIndex, dayDeltaRaw))

      return { workerDelta, dayDelta, timeMs }
    },
    [workerIndex, workers.length, dayIndex, days.length],
  )

  const handleMovePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (!onShiftMove) return
    if (event.button !== 0) return
    const cell = cellRef.current
    if (!cell) return
    const rect = cell.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    dragGeomRef.current = {
      x: event.clientX,
      y: event.clientY,
      cellWidth: rect.width,
      cellHeight: rect.height,
      msPerPx: (cellMinutes * 60 * 1000) / rect.height,
    }
    isDraggingRef.current = false
  }

  React.useEffect(() => {
    if (!onShiftMove) return

    const onPointerMove = (event: PointerEvent) => {
      const geom = dragGeomRef.current
      if (!geom) return
      const dx = event.clientX - geom.x
      const dy = event.clientY - geom.y
      if (!isDraggingRef.current && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return
      isDraggingRef.current = true
      const snap = computeSnap(event.clientX, event.clientY)
      if (snap) setDrag(snap)
    }

    const commit = (event: PointerEvent) => {
      const geom = dragGeomRef.current
      if (!geom) return
      const wasDragging = isDraggingRef.current
      const snap = computeSnap(event.clientX, event.clientY)
      dragGeomRef.current = null
      isDraggingRef.current = false
      setDrag(null)
      if (!wasDragging || !snap) return
      if (snap.workerDelta === 0 && snap.dayDelta === 0 && snap.timeMs === 0) return
      const dayOffsetMs = snap.dayDelta * DAY_MS
      const newStart = new Date(shift.start.getTime() + dayOffsetMs + snap.timeMs)
      const newEnd = new Date(shift.end.getTime() + dayOffsetMs + snap.timeMs)
      const newWorker = workers[workerIndex + snap.workerDelta]
      if (!newWorker) return
      onShiftMove(shift, { workerId: newWorker.id, start: newStart, end: newEnd })
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', commit)
    document.addEventListener('pointercancel', commit)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', commit)
      document.removeEventListener('pointercancel', commit)
    }
  }, [onShiftMove, computeSnap, shift, workerIndex, workers])

  const resizeTop = useEventResize({
    edge: 'top',
    disabled: !onShiftResize,
    snapMinutes: 15,
    getDelta: (_dx, dy) => dyToMs(dy),
    onDragging: setResizeStartDelta,
    onResize(delta) {
      setResizeStartDelta(0)
      if (!onShiftResize) return
      const newStart = new Date(shift.start.getTime() + delta)
      if (newStart < shift.end) onShiftResize(shift, newStart, shift.end)
    },
  })

  const resizeBottom = useEventResize({
    edge: 'bottom',
    disabled: !onShiftResize,
    snapMinutes: 15,
    getDelta: (_dx, dy) => dyToMs(dy),
    onDragging: setResizeEndDelta,
    onResize(delta) {
      setResizeEndDelta(0)
      if (!onShiftResize) return
      const newEnd = new Date(shift.end.getTime() + delta)
      if (newEnd > shift.start) onShiftResize(shift, shift.start, newEnd)
    },
  })

  const inCellStart = new Date(shift.start.getTime() + (drag?.timeMs ?? 0) + resizeStartDelta)
  const inCellEnd = new Date(shift.end.getTime() + (drag?.timeMs ?? 0) + resizeEndDelta)
  const top = Math.max(0, timeToPct(inCellStart))
  const bottom = Math.min(100, timeToPct(inCellEnd))
  const height = Math.max(6, bottom - top)

  const dayOffsetMs = (drag?.dayDelta ?? 0) * DAY_MS
  const finalStart = new Date(inCellStart.getTime() + dayOffsetMs)
  const finalEnd = new Date(inCellEnd.getTime() + dayOffsetMs)

  const geom = dragGeomRef.current
  const translateX = drag && geom ? drag.dayDelta * geom.cellWidth : 0
  const translateY = drag && geom ? drag.workerDelta * geom.cellHeight : 0

  const isMoving = drag !== null
  const isActive = isMoving || resizeTop.isResizing || resizeBottom.isResizing

  const stopResizePropagation =
    (handler: (event: React.PointerEvent<HTMLElement>) => void) =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation()
      handler(event)
    }

  return (
    <Tooltip open={isActive ? false : undefined}>
      <TooltipTrigger asChild>
        <div
          style={{
            top: `${top}%`,
            height: `${height}%`,
            transform:
              translateX !== 0 || translateY !== 0
                ? `translate(${translateX}px, ${translateY}px)`
                : undefined,
          }}
          className={cn(
            'absolute right-1 left-1',
            isActive && 'z-50',
            isMoving && 'transition-none',
          )}
        >
          <ShiftBlock
            segments={shift.activities ?? []}
            onClick={() => {
              if (!isActive) onShiftClick?.(shift)
            }}
            onPointerDown={handleMovePointerDown}
            className={cn(
              'touch-none select-none',
              onShiftMove ? 'cursor-grab' : onShiftClick && 'cursor-pointer',
              isActive && 'cursor-grabbing shadow-lg ring-2 ring-primary/60',
            )}
          >
            {onShiftResize && (
              <div
                onPointerDown={stopResizePropagation(resizeTop.handlers.onPointerDown)}
                className="group/handle absolute top-0 right-0 left-0 z-10 h-1.5 cursor-ns-resize touch-none"
                aria-label="Resize shift start"
              >
                <div className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-foreground/40 opacity-0 transition-opacity group-hover/shift:opacity-100" />
              </div>
            )}
            <ShiftBlock.Title>{shift.title ?? format(finalStart, 'h:mm a')}</ShiftBlock.Title>
            {shift.meta && <ShiftBlock.Meta>{shift.meta}</ShiftBlock.Meta>}
            {onShiftResize && (
              <div
                onPointerDown={stopResizePropagation(resizeBottom.handlers.onPointerDown)}
                className="group/handle absolute right-0 bottom-0 left-0 z-10 h-1.5 cursor-ns-resize touch-none"
                aria-label="Resize shift end"
              >
                <div className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-foreground/40 opacity-0 transition-opacity group-hover/shift:opacity-100" />
              </div>
            )}
          </ShiftBlock>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="font-semibold">{shift.title ?? 'Shift'}</p>
        <p className="opacity-80">
          {format(finalStart, 'h:mm a')} – {format(finalEnd, 'h:mm a')}
        </p>
        {shift.meta && <p className="opacity-80">{shift.meta}</p>}
      </TooltipContent>
    </Tooltip>
  )
}
