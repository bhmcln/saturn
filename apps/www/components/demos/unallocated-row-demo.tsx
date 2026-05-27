'use client'

import { UnallocatedRow } from '@/registry/default/ui/unallocated-row'

const TASKS_BY_DAY: string[][] = [
  [],
  ['Mrs Liu · Personal care'],
  ['Mr Davies · Wound dressing', 'Mrs Patel · Medication'],
  ['Mr Chen · Personal care'],
  ['Mrs Okafor · Domestic', 'New client intake'],
  [],
  [],
]

export function UnallocatedRowDemo() {
  const total = TASKS_BY_DAY.reduce((n, day) => n + day.length, 0)
  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-md border">
      <UnallocatedRow labelWidth="10rem" dayCount={7} className="static">
        <UnallocatedRow.Label>
          Unallocated
          <span className="ml-1 text-muted-foreground">· {total}</span>
        </UnallocatedRow.Label>
        {TASKS_BY_DAY.map((tasks, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static demo array, order is stable
          <UnallocatedRow.Cell key={i}>
            {tasks.map((title) => (
              <UnallocatedRow.Chip key={title} onClick={() => console.log('assign', title)}>
                {title}
              </UnallocatedRow.Chip>
            ))}
          </UnallocatedRow.Cell>
        ))}
      </UnallocatedRow>
    </div>
  )
}
