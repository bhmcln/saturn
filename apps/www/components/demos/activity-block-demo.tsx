'use client'

import type { ActivityType } from '@/registry/default/lib/activity-colors'
import { ActivityBlock } from '@/registry/default/ui/activity-block'

const SAMPLES: Array<{ type: ActivityType; title: string; time: string }> = [
  { type: 'TASK', title: 'Mrs Patel · Personal care', time: '7:30 – 8:30 AM' },
  { type: 'TRAVEL', title: 'Travel · 2.4 km', time: '8:30 – 8:50 AM' },
  { type: 'BREAK', title: 'Lunch break', time: '12:30 – 1:15 PM' },
  { type: 'TRAINING', title: 'CPR refresher', time: '9:00 – 12:00 PM' },
  { type: 'ADMIN', title: 'Care plan updates', time: '11:45 – 12:30 PM' },
  { type: 'UNAVAILABLE', title: 'Annual leave', time: 'All day' },
]

export function ActivityBlockDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {SAMPLES.map(({ type, title, time }) => (
        <div key={type} className="h-16">
          <ActivityBlock type={type}>
            <ActivityBlock.Title>{title}</ActivityBlock.Title>
            <ActivityBlock.Time>{time}</ActivityBlock.Time>
          </ActivityBlock>
        </div>
      ))}
    </div>
  )
}
