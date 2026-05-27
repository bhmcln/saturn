'use client'

import { type CalendarEvent, MonthView } from '@/registry/default/ui/month-view'
import { useState } from 'react'

function makeEvents(anchor: Date): CalendarEvent[] {
  const day = (offset: number, h: number, m: number) => {
    const d = new Date(anchor)
    d.setDate(d.getDate() + offset)
    d.setHours(h, m, 0, 0)
    return d
  }
  return [
    { id: '1', title: 'Standup', start: day(0, 9, 0), end: day(0, 9, 30), color: 'blue' },
    { id: '2', title: 'Design review', start: day(0, 10, 0), end: day(0, 11, 30), color: 'pink' },
    { id: '3', title: 'Demo day', start: day(2, 14, 0), end: day(2, 16, 0), color: 'green' },
    { id: '4', title: 'Sprint retro', start: day(4, 16, 0), end: day(4, 17, 0), color: 'pink' },
    { id: '5', title: 'Customer call', start: day(4, 11, 0), end: day(4, 12, 0), color: 'blue' },
    {
      id: '6',
      title: 'Architecture review',
      start: day(4, 13, 0),
      end: day(4, 15, 0),
      color: 'amber',
    },
    {
      id: '7',
      title: '1:1 with Sam',
      start: day(4, 15, 30),
      end: day(4, 16, 0),
      color: 'purple',
    },
    {
      id: '8',
      title: 'Roster planning',
      start: day(7, 10, 0),
      end: day(7, 12, 0),
      color: 'green',
    },
  ]
}

export function MonthViewDemo() {
  const [date, setDate] = useState(() => new Date())
  const events = makeEvents(date)
  return (
    <MonthView date={date} onDateChange={setDate} onDateSelect={setDate} events={events}>
      <MonthView.Header>
        <MonthView.Title />
        <MonthView.Navigation />
      </MonthView.Header>
      <MonthView.Body>
        <MonthView.WeekdayLabels />
        <MonthView.Grid maxEventsPerDay={3} />
      </MonthView.Body>
    </MonthView>
  )
}
