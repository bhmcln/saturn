'use client'

import { ShiftBlock } from '@/registry/default/ui/shift-block'

export function ShiftBlockDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="h-32">
        <ShiftBlock
          segments={[
            { type: 'TASK', weight: 60 },
            { type: 'TRAVEL', weight: 20 },
            { type: 'TASK', weight: 30 },
            { type: 'BREAK', weight: 10 },
          ]}
        >
          <ShiftBlock.Title>Aisha Khan</ShiftBlock.Title>
          <ShiftBlock.Meta>7:30 AM – 3:30 PM</ShiftBlock.Meta>
          <ShiftBlock.Meta>6 visits · 8h</ShiftBlock.Meta>
        </ShiftBlock>
      </div>
      <div className="h-32">
        <ShiftBlock segments={[{ type: 'TRAINING', weight: 1 }]}>
          <ShiftBlock.Title>Marcus Lee</ShiftBlock.Title>
          <ShiftBlock.Meta>9:00 AM – 1:00 PM</ShiftBlock.Meta>
          <ShiftBlock.Meta>CPR refresher</ShiftBlock.Meta>
        </ShiftBlock>
      </div>
      <div className="h-32">
        <ShiftBlock segments={[{ type: 'UNAVAILABLE', weight: 1 }]}>
          <ShiftBlock.Title>Sam Okoye</ShiftBlock.Title>
          <ShiftBlock.Meta>Annual leave</ShiftBlock.Meta>
        </ShiftBlock>
      </div>
    </div>
  )
}
