'use client'

import {
  type RosterDayActivity,
  RosterDayDetail,
  type RosterDayWorker,
} from '@/registry/default/blocks/roster-day-detail'
import { useState } from 'react'

const WORKERS: RosterDayWorker[] = [
  { id: 'aisha', name: 'Aisha Khan', initials: 'AK', meta: 'Senior care' },
  { id: 'marcus', name: 'Marcus Lee', initials: 'ML', meta: 'Personal care' },
  { id: 'priya', name: 'Priya Singh', initials: 'PS', meta: 'Wound care RN' },
  { id: 'sam', name: 'Sam Okoye', initials: 'SO', meta: 'Domestic' },
  { id: 'maria', name: 'Maria Costa', initials: 'MC', meta: 'Senior care' },
]

function buildActivities(date: Date): RosterDayActivity[] {
  const at = (h: number, m: number): Date => {
    const d = new Date(date)
    d.setHours(h, m, 0, 0)
    return d
  }

  return [
    // Aisha — 4 visits with travel between, lunch break
    {
      id: 'a1',
      workerId: 'aisha',
      type: 'TRAVEL',
      start: at(7, 0),
      end: at(7, 30),
      title: 'Travel',
    },
    {
      id: 'a2',
      workerId: 'aisha',
      type: 'TASK',
      start: at(7, 30),
      end: at(9, 0),
      title: 'Mrs Patel',
      meta: 'Personal care',
    },
    {
      id: 'a3',
      workerId: 'aisha',
      type: 'TRAVEL',
      start: at(9, 0),
      end: at(9, 30),
      title: 'Travel',
    },
    {
      id: 'a4',
      workerId: 'aisha',
      type: 'TASK',
      start: at(9, 30),
      end: at(11, 0),
      title: 'Mr Chen',
      meta: 'Personal care',
    },
    {
      id: 'a5',
      workerId: 'aisha',
      type: 'BREAK',
      start: at(11, 0),
      end: at(11, 30),
      title: 'Lunch',
    },
    {
      id: 'a6',
      workerId: 'aisha',
      type: 'TASK',
      start: at(11, 30),
      end: at(13, 0),
      title: 'Mrs Liu',
      meta: 'Wound dressing',
    },
    {
      id: 'a7',
      workerId: 'aisha',
      type: 'TASK',
      start: at(13, 30),
      end: at(15, 0),
      title: 'Mr Davies',
      meta: 'Medication',
    },
    // Marcus — CPR training all morning, two visits afternoon
    {
      id: 'b1',
      workerId: 'marcus',
      type: 'TRAINING',
      start: at(9, 0),
      end: at(13, 0),
      title: 'CPR refresher',
    },
    {
      id: 'b2',
      workerId: 'marcus',
      type: 'TRAVEL',
      start: at(13, 30),
      end: at(14, 0),
      title: 'Travel',
    },
    {
      id: 'b3',
      workerId: 'marcus',
      type: 'TASK',
      start: at(14, 0),
      end: at(15, 30),
      title: 'Mr Okafor',
      meta: 'Personal care',
    },
    {
      id: 'b4',
      workerId: 'marcus',
      type: 'TASK',
      start: at(15, 45),
      end: at(17, 0),
      title: 'Mrs Singh',
      meta: 'Personal care',
    },
    // Priya — RN double shift
    {
      id: 'c1',
      workerId: 'priya',
      type: 'TASK',
      start: at(9, 0),
      end: at(10, 30),
      title: 'Mrs Costa',
      meta: 'Wound care',
    },
    {
      id: 'c2',
      workerId: 'priya',
      type: 'TASK',
      start: at(11, 0),
      end: at(12, 30),
      title: 'Mr Park',
      meta: 'Medication review',
    },
    {
      id: 'c3',
      workerId: 'priya',
      type: 'ADMIN',
      start: at(13, 0),
      end: at(14, 0),
      title: 'Care plans',
    },
    {
      id: 'c4',
      workerId: 'priya',
      type: 'TASK',
      start: at(14, 30),
      end: at(16, 0),
      title: 'Mrs Khan',
      meta: 'Wound dressing',
    },
    // Sam — unavailable
    {
      id: 'd1',
      workerId: 'sam',
      type: 'UNAVAILABLE',
      start: at(6, 0),
      end: at(22, 0),
      title: 'Annual leave',
    },
    // Maria — early start, multiple short visits
    {
      id: 'e1',
      workerId: 'maria',
      type: 'TASK',
      start: at(6, 30),
      end: at(7, 30),
      title: 'Mr Lee',
      meta: 'Morning routine',
    },
    {
      id: 'e2',
      workerId: 'maria',
      type: 'TRAVEL',
      start: at(7, 30),
      end: at(7, 45),
      title: 'Travel',
    },
    {
      id: 'e3',
      workerId: 'maria',
      type: 'TASK',
      start: at(7, 45),
      end: at(9, 0),
      title: 'Mrs Costa',
      meta: 'Morning routine',
    },
    {
      id: 'e4',
      workerId: 'maria',
      type: 'TASK',
      start: at(9, 30),
      end: at(11, 0),
      title: 'Mr Sayed',
      meta: 'Personal care',
    },
    {
      id: 'e5',
      workerId: 'maria',
      type: 'BREAK',
      start: at(11, 0),
      end: at(11, 30),
      title: 'Lunch',
    },
    {
      id: 'e6',
      workerId: 'maria',
      type: 'TASK',
      start: at(11, 30),
      end: at(13, 0),
      title: 'Mrs Brown',
      meta: 'Medication',
    },
    {
      id: 'e7',
      workerId: 'maria',
      type: 'TASK',
      start: at(13, 30),
      end: at(14, 30),
      title: 'Mr Hayes',
      meta: 'Domestic',
    },
  ]
}

export function RosterDayDetailDemo() {
  const [date, setDate] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [activities, setActivities] = useState<RosterDayActivity[]>(() => buildActivities(date))

  const handleDateChange = (next: Date) => {
    const d = new Date(next)
    d.setHours(0, 0, 0, 0)
    setDate(d)
    setActivities(buildActivities(d))
  }

  const updateActivity = (id: string, start: Date, end: Date) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, start, end } : a)))
  }

  return (
    <RosterDayDetail
      date={date}
      workers={WORKERS}
      activities={activities}
      onDateChange={handleDateChange}
      onActivityClick={(a) => console.log('activity', a.id)}
      onActivityMove={(a, start, end) => updateActivity(a.id, start, end)}
      onActivityResize={(a, start, end) => updateActivity(a.id, start, end)}
    />
  )
}
