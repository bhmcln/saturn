'use client'

import { format, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

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
        {workers.map((worker) => (
          <WorkerRow
            key={worker.id}
            worker={worker}
            shifts={shiftsByWorker.get(worker.id) ?? []}
            days={weekDays}
            cellTimeRange={cellTimeRange}
            labelWidth={labelWidth}
            onShiftClick={onShiftClick}
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
  shifts: RosterShift[]
  days: Date[]
  cellTimeRange: [number, number]
  labelWidth: string
  onShiftClick?: (shift: RosterShift) => void
}

function WorkerRow({
  worker,
  shifts,
  days,
  cellTimeRange,
  labelWidth,
  onShiftClick,
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
      {days.map((day) => (
        <DayCell
          key={day.toISOString()}
          shifts={shifts.filter((s) => isSameDay(s.start, day))}
          cellTimeRange={cellTimeRange}
          onShiftClick={onShiftClick}
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
  shifts: RosterShift[]
  cellTimeRange: [number, number]
  onShiftClick?: (shift: RosterShift) => void
}

function DayCell({ shifts, cellTimeRange, onShiftClick }: DayCellProps) {
  const [startHour, endHour] = cellTimeRange
  const cellMinutes = Math.max(1, (endHour - startHour) * 60)

  function timeToPct(date: Date): number {
    const minutes = date.getHours() * 60 + date.getMinutes() - startHour * 60
    return (minutes / cellMinutes) * 100
  }

  return (
    <div className="relative border-l first-of-type:border-l-0">
      {shifts.map((shift) => {
        const top = Math.max(0, timeToPct(shift.start))
        const bottom = Math.min(100, timeToPct(shift.end))
        const height = Math.max(6, bottom - top)
        return (
          <Tooltip key={shift.id}>
            <TooltipTrigger asChild>
              <div
                style={{ top: `${top}%`, height: `${height}%` }}
                className="absolute right-1 left-1"
              >
                <ShiftBlock
                  segments={shift.activities ?? []}
                  onClick={() => onShiftClick?.(shift)}
                  className="cursor-pointer"
                >
                  <ShiftBlock.Title>
                    {shift.title ?? format(shift.start, 'h:mm a')}
                  </ShiftBlock.Title>
                  {shift.meta && <ShiftBlock.Meta>{shift.meta}</ShiftBlock.Meta>}
                </ShiftBlock>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="font-semibold">{shift.title ?? 'Shift'}</p>
              <p className="opacity-80">
                {format(shift.start, 'h:mm a')} – {format(shift.end, 'h:mm a')}
              </p>
              {shift.meta && <p className="opacity-80">{shift.meta}</p>}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
