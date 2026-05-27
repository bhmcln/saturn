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
    {
      id: '1',
      title: 'Breakfast',
      start: day(0, 6, 0),
      end: day(0, 7, 0),
      color: 'blue',
    },
    {
      id: '2',
      title: 'Flight to Paris',
      start: day(0, 7, 30),
      end: day(0, 10, 0),
      color: 'pink',
    },
    {
      id: '3',
      title: 'Design review',
      start: day(2, 10, 0),
      end: day(2, 12, 0),
      color: 'green',
    },
    {
      id: '4',
      title: 'Sam’s birthday',
      start: day(4, 14, 0),
      end: day(4, 16, 0),
      color: 'amber',
    },
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
