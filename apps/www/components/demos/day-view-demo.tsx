'use client'

import { type CalendarEvent, DayView } from '@/registry/default/ui/day-view'
import { useState } from 'react'

/**
 * A single care worker's "run" — back-to-back client visits with travel
 * blocks between, a mid-morning admin task, and a lunch break.
 */
function makeRun(anchor: Date): CalendarEvent[] {
  const at = (h: number, m: number) => {
    const d = new Date(anchor)
    d.setHours(h, m, 0, 0)
    return d
  }
  return [
    {
      id: '1',
      title: 'Mrs Patel · Personal care',
      start: at(7, 30),
      end: at(8, 30),
      color: 'blue',
    },
    { id: '2', title: 'Travel', start: at(8, 30), end: at(8, 50), color: 'gray' },
    { id: '3', title: 'Mr Chen · Medication', start: at(8, 50), end: at(9, 30), color: 'green' },
    { id: '4', title: 'Travel', start: at(9, 30), end: at(9, 55), color: 'gray' },
    { id: '5', title: 'Mrs Okafor · Domestic', start: at(10, 0), end: at(11, 30), color: 'blue' },
    {
      id: '6',
      title: 'Admin · Care plan updates',
      start: at(11, 45),
      end: at(12, 30),
      color: 'purple',
    },
    { id: '7', title: 'Lunch', start: at(12, 30), end: at(13, 15), color: 'amber' },
    { id: '8', title: 'Mr Davies · Wound care', start: at(13, 30), end: at(14, 30), color: 'pink' },
    { id: '9', title: 'Travel', start: at(14, 30), end: at(14, 50), color: 'gray' },
    {
      id: '10',
      title: 'Mrs Liu · Social support',
      start: at(15, 0),
      end: at(16, 0),
      color: 'blue',
    },
  ]
}

export function DayViewDemo() {
  const [date, setDate] = useState(() => new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(() => makeRun(new Date()))

  const updateRange = (event: CalendarEvent, newStart: Date, newEnd: Date) => {
    setEvents((current) =>
      current.map((e) => (e.id === event.id ? { ...e, start: newStart, end: newEnd } : e)),
    )
  }

  return (
    <DayView
      date={date}
      onDateChange={setDate}
      events={events}
      onEventMove={updateRange}
      onEventResize={updateRange}
      onEventCreate={(start, end) =>
        setEvents((current) => [
          ...current,
          { id: `new-${Date.now()}`, title: 'New visit', start, end, color: 'blue' },
        ])
      }
    >
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
