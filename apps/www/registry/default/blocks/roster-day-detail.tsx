'use client'

import { addDays, format, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import type { ActivityType } from '@/registry/default/lib/activity-colors'
import { cn } from '@/registry/default/lib/utils'
import { ActivityBlock } from '@/registry/default/ui/activity-block'
import { ResourceRow } from '@/registry/default/ui/resource-row'
import { TimelineView } from '@/registry/default/ui/timeline-view'

export interface RosterDayWorker {
  id: string
  name: string
  initials?: string
  meta?: React.ReactNode
}

export interface RosterDayActivity {
  id: string
  workerId: string
  type: ActivityType
  start: Date
  end: Date
  title?: string
  meta?: string
}

export interface RosterDayDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date
  workers: RosterDayWorker[]
  activities: RosterDayActivity[]
  /** Inclusive viewport start. Default = `date` at 6 AM. */
  viewportStart?: Date
  /** Exclusive viewport end. Default = `date` at 10 PM. */
  viewportEnd?: Date
  labelWidth?: string
  rowHeight?: string
  onDateChange?: (date: Date) => void
  onActivityClick?: (activity: RosterDayActivity) => void
  onActivityMove?: (activity: RosterDayActivity, newStart: Date, newEnd: Date) => void
  onActivityResize?: (activity: RosterDayActivity, newStart: Date, newEnd: Date) => void
  onActivityCreate?: (workerId: string, start: Date, end: Date) => void
}

function setHour(d: Date, h: number): Date {
  const next = new Date(d)
  next.setHours(h, 0, 0, 0)
  return next
}

export function RosterDayDetail({
  date,
  workers,
  activities,
  viewportStart,
  viewportEnd,
  labelWidth = '14rem',
  rowHeight = '5rem',
  onDateChange,
  onActivityClick,
  onActivityMove,
  onActivityResize,
  onActivityCreate,
  className,
  ...props
}: RosterDayDetailProps) {
  const start = viewportStart ?? setHour(date, 6)
  const end = viewportEnd ?? setHour(date, 22)

  const activitiesByWorker = React.useMemo(() => {
    const map = new Map<string, RosterDayActivity[]>()
    for (const a of activities) {
      if (!isSameDay(a.start, date)) continue
      const list = map.get(a.workerId) ?? []
      list.push(a)
      map.set(a.workerId, list)
    }
    return map
  }, [activities, date])

  const visibleCount = React.useMemo(
    () => activities.filter((a) => isSameDay(a.start, date)).length,
    [activities, date],
  )

  return (
    <TimelineView
      viewportStart={start}
      viewportEnd={end}
      labelWidth={labelWidth}
      className={className}
      {...props}
    >
      <TimelineView.Header>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            <time dateTime={format(date, 'yyyy-MM-dd')}>{format(date, 'EEEE, MMMM d')}</time>
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            <span className="font-medium text-foreground">{workers.length}</span> workers ·{' '}
            <span className="font-medium text-foreground">{visibleCount}</span> activities
          </p>
        </div>
        <DayNav date={date} onDateChange={onDateChange} />
      </TimelineView.Header>
      <TimelineView.HourRuler />
      <TimelineView.Body>
        {isSameDay(date, new Date()) && <TimelineView.NowIndicator />}
        {workers.map((worker) => (
          <ResourceRow
            key={worker.id}
            height={rowHeight}
            label={<WorkerLabel worker={worker} />}
            onCreateBlock={
              onActivityCreate
                ? (blockStart, blockEnd) => onActivityCreate(worker.id, blockStart, blockEnd)
                : undefined
            }
          >
            {(activitiesByWorker.get(worker.id) ?? []).map((activity) => (
              <ResourceRow.Block
                key={activity.id}
                start={activity.start}
                end={activity.end}
                onMove={
                  onActivityMove
                    ? (newStart, newEnd) => onActivityMove(activity, newStart, newEnd)
                    : undefined
                }
                onResize={
                  onActivityResize
                    ? (newStart, newEnd) => onActivityResize(activity, newStart, newEnd)
                    : undefined
                }
                onClick={() => onActivityClick?.(activity)}
                className={cn(onActivityClick && 'cursor-pointer')}
              >
                <ActivityBlock type={activity.type} className="h-full">
                  <ActivityBlock.Title>
                    {activity.title ?? format(activity.start, 'h:mm a')}
                  </ActivityBlock.Title>
                  {activity.meta && <ActivityBlock.Time>{activity.meta}</ActivityBlock.Time>}
                </ActivityBlock>
              </ResourceRow.Block>
            ))}
          </ResourceRow>
        ))}
      </TimelineView.Body>
    </TimelineView>
  )
}

function WorkerLabel({ worker }: { worker: RosterDayWorker }) {
  const initials = worker.initials ?? worker.name.slice(0, 2).toUpperCase()
  return (
    <>
      <span className="flex size-8 flex-none items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{worker.name}</p>
        {worker.meta && <p className="truncate text-xs text-muted-foreground">{worker.meta}</p>}
      </div>
    </>
  )
}

function DayNav({
  date,
  onDateChange,
}: {
  date: Date
  onDateChange?: (date: Date) => void
}) {
  return (
    <div className="flex items-center rounded-md border bg-background shadow-xs">
      <button
        type="button"
        onClick={() => onDateChange?.(addDays(date, -1))}
        className="flex h-9 w-9 items-center justify-center rounded-l-md text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous day</span>
      </button>
      <button
        type="button"
        onClick={() => onDateChange?.(new Date())}
        className="border-x px-3 text-sm font-semibold text-foreground hover:bg-accent"
      >
        Today
      </button>
      <button
        type="button"
        onClick={() => onDateChange?.(addDays(date, 1))}
        className="flex h-9 w-9 items-center justify-center rounded-r-md text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next day</span>
      </button>
    </div>
  )
}
