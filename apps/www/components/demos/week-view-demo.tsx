'use client'

import { type CalendarEvent, WeekView } from '@/registry/default/ui/week-view'
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
    { id: '3', title: 'Lunch w/ Lena', start: day(1, 12, 30), end: day(1, 13, 30), color: 'amber' },
    { id: '4', title: 'Roster planning', start: day(2, 14, 0), end: day(2, 16, 0), color: 'green' },
    { id: '5', title: 'Shift handover', start: day(3, 8, 0), end: day(3, 9, 0), color: 'purple' },
    { id: '6', title: 'Customer demo', start: day(4, 15, 0), end: day(4, 16, 0), color: 'blue' },
  ]
}

export function WeekViewDemo() {
  const [date, setDate] = useState(() => new Date())
  const events = makeEvents(date)

  return (
    <WeekView
      date={date}
      onDateChange={setDate}
      events={events}
      onEventClick={(e) => console.log('clicked', e)}
    >
      <WeekView.Header>
        <WeekView.Title />
        <WeekView.Navigation />
      </WeekView.Header>
      <WeekView.Body>
        <WeekView.DayLabels />
        <WeekView.Grid />
      </WeekView.Body>
    </WeekView>
  )
}
