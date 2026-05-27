'use client'

import {
  RosterPlanner,
  type RosterShift,
  type RosterUnallocatedTask,
  type RosterWorker,
} from '@/registry/default/blocks/roster-planner'
import { startOfWeek } from 'date-fns'
import { useState } from 'react'

const WORKERS: RosterWorker[] = [
  { id: 'aisha', name: 'Aisha Khan', initials: 'AK', meta: '38h · Senior care' },
  { id: 'marcus', name: 'Marcus Lee', initials: 'ML', meta: '32h · Personal care' },
  { id: 'priya', name: 'Priya Singh', initials: 'PS', meta: '30h · Wound care RN' },
  { id: 'sam', name: 'Sam Okoye', initials: 'SO', meta: '20h · Domestic' },
  { id: 'maria', name: 'Maria Costa', initials: 'MC', meta: '36h · Senior care' },
  { id: 'jin', name: 'Jin Park', initials: 'JP', meta: '28h · Bank staff' },
]

function buildShifts(weekStart: Date): RosterShift[] {
  const at = (dayOffset: number, h: number, m: number): Date => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + dayOffset)
    d.setHours(h, m, 0, 0)
    return d
  }

  const shifts: RosterShift[] = []
  let id = 0
  const push = (
    workerId: string,
    dayOffset: number,
    startH: number,
    endH: number,
    meta?: string,
    activityMix: 'normal' | 'training' | 'leave' = 'normal',
  ) => {
    const start = at(dayOffset, startH, 0)
    const end = at(dayOffset, endH, 0)
    const totalMs = end.getTime() - start.getTime()
    const activities =
      activityMix === 'leave'
        ? [{ type: 'UNAVAILABLE' as const, weight: 1 }]
        : activityMix === 'training'
          ? [{ type: 'TRAINING' as const, weight: 1 }]
          : [
              { type: 'TASK' as const, weight: totalMs * 0.55 },
              { type: 'TRAVEL' as const, weight: totalMs * 0.15 },
              { type: 'TASK' as const, weight: totalMs * 0.2 },
              { type: 'BREAK' as const, weight: totalMs * 0.1 },
            ]
    shifts.push({
      id: `s${++id}`,
      workerId,
      start,
      end,
      activities,
      meta,
    })
  }

  // Aisha — Mon-Fri standard
  for (let d = 0; d < 5; d++) push('aisha', d, 7, 15, '6 visits')
  // Marcus — Mon-Thu, Wed is training
  push('marcus', 0, 8, 16, '5 visits')
  push('marcus', 1, 8, 16, '5 visits')
  push('marcus', 2, 9, 13, 'CPR refresher', 'training')
  push('marcus', 3, 8, 16, '4 visits')
  // Priya — Tue-Sat, RN shifts
  for (let d = 1; d < 6; d++) push('priya', d, 9, 17, 'Wound + medication')
  // Sam — Mon, Wed, Fri only; Thu off
  push('sam', 0, 9, 14, '3 domestic')
  push('sam', 2, 9, 14, '3 domestic')
  push('sam', 4, 9, 14, '4 domestic')
  push('sam', 3, 0, 24, 'Annual leave', 'leave')
  // Maria — every day
  for (let d = 0; d < 7; d++) push('maria', d, 6, 14, '5 visits')
  // Jin — flexible: Tue, Thu, Sat
  push('jin', 1, 14, 20, 'Evening cover')
  push('jin', 3, 14, 20, 'Evening cover')
  push('jin', 5, 10, 18, 'Weekend cover')

  return shifts
}

function buildUnallocated(weekStart: Date): RosterUnallocatedTask[] {
  const dayAt = (offset: number): Date => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + offset)
    d.setHours(0, 0, 0, 0)
    return d
  }
  return [
    { id: 'u1', day: dayAt(1), title: 'Mrs Liu · Personal care' },
    { id: 'u2', day: dayAt(2), title: 'Mr Davies · Wound dressing' },
    { id: 'u3', day: dayAt(2), title: 'Mrs Patel · Medication' },
    { id: 'u4', day: dayAt(3), title: 'Mr Chen · Personal care' },
    { id: 'u5', day: dayAt(4), title: 'Mrs Okafor · Domestic' },
    { id: 'u6', day: dayAt(4), title: 'New client intake' },
  ]
}

export function RosterPlannerDemo() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [shifts, setShifts] = useState<RosterShift[]>(() => buildShifts(weekStart))
  const unallocated = buildUnallocated(weekStart)

  const handleWeekChange = (date: Date) => {
    const next = startOfWeek(date, { weekStartsOn: 1 })
    setWeekStart(next)
    setShifts(buildShifts(next))
  }

  const updateShift = (id: string, patch: { workerId?: string; start: Date; end: Date }) => {
    setShifts((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  return (
    <RosterPlanner
      weekStart={weekStart}
      weekStartsOn={1}
      workers={WORKERS}
      shifts={shifts}
      unallocated={unallocated}
      onWeekChange={handleWeekChange}
      onShiftClick={(s) => console.log('shift', s.id)}
      onTaskClick={(t) => console.log('task', t.id)}
      onShiftMove={(s, target) => updateShift(s.id, target)}
      onShiftResize={(s, start, end) => updateShift(s.id, { start, end })}
    />
  )
}
