'use client'

import { ActivityBlock } from '@/registry/default/ui/activity-block'
import { ResourceRow } from '@/registry/default/ui/resource-row'
import { TimelineView } from '@/registry/default/ui/timeline-view'

function at(h: number, m: number): Date {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

const today = new Date()
const dayStart = (() => {
  const d = new Date(today)
  d.setHours(7, 0, 0, 0)
  return d
})()
const dayEnd = (() => {
  const d = new Date(today)
  d.setHours(17, 0, 0, 0)
  return d
})()

export function ResourceRowDemo() {
  return (
    <TimelineView viewportStart={dayStart} viewportEnd={dayEnd} labelWidth="10rem">
      <TimelineView.HourRuler />
      <TimelineView.Body>
        <ResourceRow label={<span className="truncate font-medium">Aisha Khan</span>}>
          <ResourceRow.Block start={at(8, 0)} end={at(9, 30)}>
            <ActivityBlock type="TASK">
              <ActivityBlock.Title>Mrs Patel · Personal care</ActivityBlock.Title>
              <ActivityBlock.Time>8:00 – 9:30 AM</ActivityBlock.Time>
            </ActivityBlock>
          </ResourceRow.Block>
          <ResourceRow.Block start={at(11, 0)} end={at(12, 30)}>
            <ActivityBlock type="TASK">
              <ActivityBlock.Title>Mr Chen · Medication</ActivityBlock.Title>
              <ActivityBlock.Time>11:00 – 12:30 PM</ActivityBlock.Time>
            </ActivityBlock>
          </ResourceRow.Block>
          <ResourceRow.Block start={at(13, 30)} end={at(15, 30)}>
            <ActivityBlock type="TRAINING">
              <ActivityBlock.Title>Manual handling refresher</ActivityBlock.Title>
              <ActivityBlock.Time>1:30 – 3:30 PM</ActivityBlock.Time>
            </ActivityBlock>
          </ResourceRow.Block>
        </ResourceRow>
      </TimelineView.Body>
    </TimelineView>
  )
}
