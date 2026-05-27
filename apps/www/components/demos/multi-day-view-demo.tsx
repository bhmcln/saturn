'use client'

import { type CalendarEvent, MultiDayView } from '@/registry/default/ui/multi-day-view'
import { useState } from 'react'

function makeEvents(anchor: Date): CalendarEvent[] {
  const at = (offset: number, h: number, m: number) => {
    const d = new Date(anchor)
    d.setDate(d.getDate() + offset)
    d.setHours(h, m, 0, 0)
    return d
  }
  return [
    {
      id: '1',
      title: 'Mrs Patel · Personal care',
      start: at(0, 7, 30),
      end: at(0, 8, 30),
      color: 'blue',
    },
    {
      id: '2',
      title: 'Mr Chen · Medication',
      start: at(0, 9, 0),
      end: at(0, 9, 45),
      color: 'green',
    },
    {
      id: '3',
      title: 'Mrs Okafor · Domestic',
      start: at(0, 10, 30),
      end: at(0, 12, 0),
      color: 'blue',
    },
    { id: '4', title: 'Lunch', start: at(0, 12, 30), end: at(0, 13, 15), color: 'amber' },
    {
      id: '5',
      title: 'Mr Davies · Wound care',
      start: at(1, 9, 0),
      end: at(1, 10, 0),
      color: 'pink',
    },
    { id: '6', title: 'CPR refresher', start: at(1, 13, 0), end: at(1, 15, 0), color: 'purple' },
    {
      id: '7',
      title: 'Mrs Liu · Social support',
      start: at(2, 14, 0),
      end: at(2, 15, 30),
      color: 'blue',
    },
    {
      id: '8',
      title: 'Handover · Branch',
      start: at(2, 16, 0),
      end: at(2, 17, 0),
      color: 'purple',
    },
  ]
}

export function MultiDayViewDemo() {
  const [date, setDate] = useState(() => new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(() => makeEvents(new Date()))

  const updateRange = (event: CalendarEvent, newStart: Date, newEnd: Date) => {
    setEvents((current) =>
      current.map((e) => (e.id === event.id ? { ...e, start: newStart, end: newEnd } : e)),
    )
  }

  return (
    <MultiDayView
      date={date}
      days={3}
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
      <MultiDayView.Header>
        <MultiDayView.Title />
        <MultiDayView.Navigation />
      </MultiDayView.Header>
      <MultiDayView.Body>
        <MultiDayView.DayLabels />
        <MultiDayView.Grid />
      </MultiDayView.Body>
    </MultiDayView>
  )
}
