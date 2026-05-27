'use client'

import { type CalendarEvent, DayView } from '@/registry/default/ui/day-view'
import { useState } from 'react'

const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Standup',
    start: setTime(new Date(), 9, 0),
    end: setTime(new Date(), 9, 30),
    color: 'blue',
  },
  {
    id: '2',
    title: 'Design review',
    start: setTime(new Date(), 10, 0),
    end: setTime(new Date(), 11, 30),
    color: 'pink',
  },
  {
    id: '3',
    title: 'Lunch',
    start: setTime(new Date(), 12, 30),
    end: setTime(new Date(), 13, 30),
    color: 'amber',
  },
  {
    id: '4',
    title: 'Architecture review',
    start: setTime(new Date(), 14, 0),
    end: setTime(new Date(), 16, 0),
    color: 'green',
  },
]

function setTime(date: Date, h: number, m: number) {
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return d
}

export function DayViewDemo() {
  const [date, setDate] = useState(() => new Date())
  return (
    <DayView date={date} onDateChange={setDate} events={events}>
      <DayView.Header>
        <DayView.Title />
        <DayView.Navigation />
      </DayView.Header>
      <DayView.Body>
        <DayView.Grid />
      </DayView.Body>
    </DayView>
  )
}
