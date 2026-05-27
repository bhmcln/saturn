'use client'

import type { ActivityType } from '@/registry/default/lib/activity-colors'
import { ActivityBlock } from '@/registry/default/ui/activity-block'
import { ResourceRow } from '@/registry/default/ui/resource-row'
import { SwimlaneGroup } from '@/registry/default/ui/swimlane-view'
import { TimelineView } from '@/registry/default/ui/timeline-view'

function at(h: number, m: number): Date {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

interface Block {
  start: Date
  end: Date
  type: ActivityType
  title: string
}

interface Worker {
  id: string
  name: string
  initials: string
  blocks: Block[]
}

const SENIOR_CARE: Worker[] = [
  {
    id: 'aisha',
    name: 'Aisha Khan',
    initials: 'AK',
    blocks: [
      { start: at(8, 0), end: at(9, 30), type: 'TASK', title: 'Mrs Patel' },
      { start: at(10, 0), end: at(11, 30), type: 'TASK', title: 'Mr Chen' },
      { start: at(13, 0), end: at(15, 0), type: 'TASK', title: 'Mrs Okafor' },
    ],
  },
  {
    id: 'marcus',
    name: 'Marcus Lee',
    initials: 'ML',
    blocks: [
      { start: at(9, 0), end: at(12, 0), type: 'TRAINING', title: 'CPR refresher' },
      { start: at(13, 0), end: at(14, 30), type: 'TASK', title: 'Mr Hayes' },
    ],
  },
]

const DOMESTIC: Worker[] = [
  {
    id: 'priya',
    name: 'Priya Singh',
    initials: 'PS',
    blocks: [
      { start: at(8, 30), end: at(10, 0), type: 'TASK', title: 'Mr Davies' },
      { start: at(11, 0), end: at(13, 0), type: 'TASK', title: 'Mrs Liu' },
      { start: at(14, 0), end: at(15, 0), type: 'ADMIN', title: 'Care notes' },
    ],
  },
  {
    id: 'sam',
    name: 'Sam Okoye',
    initials: 'SO',
    blocks: [{ start: at(7, 0), end: at(17, 0), type: 'UNAVAILABLE', title: 'Annual leave' }],
  },
]

function WorkerLabel({ name, initials }: { name: string; initials: string }) {
  return (
    <>
      <span className="flex size-7 flex-none items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
        {initials}
      </span>
      <span className="truncate font-medium">{name}</span>
    </>
  )
}

function WorkerRow({ worker }: { worker: Worker }) {
  return (
    <ResourceRow label={<WorkerLabel name={worker.name} initials={worker.initials} />}>
      {worker.blocks.map((block) => (
        <ResourceRow.Block
          key={`${block.start.getTime()}-${block.title}`}
          start={block.start}
          end={block.end}
        >
          <ActivityBlock type={block.type}>
            <ActivityBlock.Title>{block.title}</ActivityBlock.Title>
          </ActivityBlock>
        </ResourceRow.Block>
      ))}
    </ResourceRow>
  )
}

export function SwimlaneViewDemo() {
  const dayStart = (() => {
    const d = new Date()
    d.setHours(6, 0, 0, 0)
    return d
  })()
  const dayEnd = (() => {
    const d = new Date()
    d.setHours(18, 0, 0, 0)
    return d
  })()

  return (
    <TimelineView viewportStart={dayStart} viewportEnd={dayEnd}>
      <TimelineView.HourRuler />
      <TimelineView.Body>
        <SwimlaneGroup title="Senior care team" meta={`${SENIOR_CARE.length} workers`} collapsible>
          {SENIOR_CARE.map((w) => (
            <WorkerRow key={w.id} worker={w} />
          ))}
        </SwimlaneGroup>
        <SwimlaneGroup title="Domestic team" meta={`${DOMESTIC.length} workers`} collapsible>
          {DOMESTIC.map((w) => (
            <WorkerRow key={w.id} worker={w} />
          ))}
        </SwimlaneGroup>
      </TimelineView.Body>
    </TimelineView>
  )
}
