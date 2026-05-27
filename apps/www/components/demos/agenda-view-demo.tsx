'use client'

import { AgendaView, type CalendarEvent } from '@/registry/default/ui/agenda-view'
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
    {
      id: '4',
      title: 'Roster planning',
      start: day(2, 14, 0),
      end: day(2, 16, 0),
      color: 'green',
    },
    { id: '5', title: 'Shift handover', start: day(3, 8, 0), end: day(3, 9, 0), color: 'purple' },
  ]
}

export function AgendaViewDemo() {
  const [date, setDate] = useState(() => new Date())
  const events = makeEvents(date)
  return (
    <AgendaView date={date} onDateChange={setDate} events={events}>
      <AgendaView.Header>
        <AgendaView.Title />
        <AgendaView.Navigation />
      </AgendaView.Header>
      <AgendaView.List />
    </AgendaView>
  )
}
