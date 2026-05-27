'use client'

import type { ActivityType } from '@/registry/default/lib/activity-colors'
import { ActivityBlock } from '@/registry/default/ui/activity-block'
import { ResourceRow } from '@/registry/default/ui/resource-row'
import { TimelineView } from '@/registry/default/ui/timeline-view'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip'
import { useState } from 'react'

interface Activity {
  id: string
  start: Date
  end: Date
  type: ActivityType
  title: string
}

interface Worker {
  id: string
  name: string
  initials: string
  activities: Activity[]
}

function at(h: number, m: number): Date {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

const WORKERS: Worker[] = [
  {
    id: 'aisha',
    name: 'Aisha Khan',
    initials: 'AK',
    activities: [
      {
        id: 'a1',
        start: at(7, 30),
        end: at(8, 30),
        type: 'TASK',
        title: 'Mrs Patel · Personal care',
      },
      { id: 'a2', start: at(8, 30), end: at(8, 50), type: 'TRAVEL', title: 'Travel · 2.4 km' },
      { id: 'a3', start: at(8, 50), end: at(9, 30), type: 'TASK', title: 'Mr Chen · Medication' },
      { id: 'a4', start: at(10, 0), end: at(11, 30), type: 'TASK', title: 'Mrs Okafor · Domestic' },
      { id: 'a5', start: at(12, 30), end: at(13, 15), type: 'BREAK', title: 'Lunch' },
      {
        id: 'a6',
        start: at(13, 30),
        end: at(14, 30),
        type: 'TASK',
        title: 'Mr Davies · Wound care',
      },
    ],
  },
  {
    id: 'marcus',
    name: 'Marcus Lee',
    initials: 'ML',
    activities: [
      { id: 'b1', start: at(9, 0), end: at(12, 0), type: 'TRAINING', title: 'CPR refresher' },
      {
        id: 'b2',
        start: at(13, 0),
        end: at(14, 0),
        type: 'TASK',
        title: 'Mrs Liu · Social support',
      },
      {
        id: 'b3',
        start: at(14, 30),
        end: at(16, 30),
        type: 'TASK',
        title: 'Mr Hayes · Personal care',
      },
    ],
  },
  {
    id: 'priya',
    name: 'Priya Singh',
    initials: 'PS',
    activities: [
      { id: 'c1', start: at(8, 0), end: at(9, 0), type: 'TASK', title: 'Mr Davies · Wound care' },
      { id: 'c2', start: at(9, 30), end: at(11, 0), type: 'TASK', title: 'Mrs Patel · Domestic' },
      { id: 'c3', start: at(11, 30), end: at(12, 0), type: 'ADMIN', title: 'Care notes' },
      {
        id: 'c4',
        start: at(13, 0),
        end: at(14, 30),
        type: 'TASK',
        title: 'Mr Chen · Personal care',
      },
    ],
  },
  {
    id: 'sam',
    name: 'Sam Okoye',
    initials: 'SO',
    activities: [
      { id: 'd1', start: at(7, 0), end: at(15, 0), type: 'UNAVAILABLE', title: 'Annual leave' },
    ],
  },
]

export function TimelineViewDemo() {
  const [today] = useState(() => new Date())
  const [workers, setWorkers] = useState<Worker[]>(WORKERS)

  const dayStart = new Date(today)
  dayStart.setHours(6, 0, 0, 0)
  const dayEnd = new Date(today)
  dayEnd.setHours(18, 0, 0, 0)

  const updateActivity = (workerId: string, activityId: string, newStart: Date, newEnd: Date) => {
    setWorkers((current) =>
      current.map((w) =>
        w.id !== workerId
          ? w
          : {
              ...w,
              activities: w.activities.map((a) =>
                a.id !== activityId ? a : { ...a, start: newStart, end: newEnd },
              ),
            },
      ),
    )
  }

  const addActivity = (workerId: string, start: Date, end: Date) => {
    setWorkers((current) =>
      current.map((w) =>
        w.id !== workerId
          ? w
          : {
              ...w,
              activities: [
                ...w.activities,
                {
                  id: `new-${Date.now()}`,
                  start,
                  end,
                  type: 'TASK',
                  title: 'New visit',
                },
              ],
            },
      ),
    )
  }

  return (
    <TimelineView viewportStart={dayStart} viewportEnd={dayEnd}>
      <TimelineView.HourRuler />
      <TimelineView.Body>
        {workers.map((worker) => (
          <ResourceRow
            key={worker.id}
            label={<WorkerLabel name={worker.name} initials={worker.initials} />}
            onCreateBlock={(start, end) => addActivity(worker.id, start, end)}
          >
            {worker.activities.map((activity) => (
              <ResourceRow.Block
                key={activity.id}
                start={activity.start}
                end={activity.end}
                onMove={(newStart, newEnd) =>
                  updateActivity(worker.id, activity.id, newStart, newEnd)
                }
                onResize={(newStart, newEnd) =>
                  updateActivity(worker.id, activity.id, newStart, newEnd)
                }
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ActivityBlock type={activity.type} className="h-full">
                      <ActivityBlock.Title>{activity.title}</ActivityBlock.Title>
                      <ActivityBlock.Time>
                        {formatTime(activity.start)} – {formatTime(activity.end)}
                      </ActivityBlock.Time>
                    </ActivityBlock>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-semibold">{activity.title}</p>
                    <p className="opacity-80">
                      {formatTime(activity.start)} – {formatTime(activity.end)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </ResourceRow.Block>
            ))}
          </ResourceRow>
        ))}
      </TimelineView.Body>
    </TimelineView>
  )
}

function WorkerLabel({ name, initials }: { name: string; initials: string }) {
  return (
    <>
      <span className="flex size-8 flex-none items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
        {initials}
      </span>
      <span className="truncate font-medium">{name}</span>
    </>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
