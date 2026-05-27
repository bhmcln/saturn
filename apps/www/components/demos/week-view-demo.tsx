'use client'

import { type CalendarEvent, WeekView } from '@/registry/default/ui/week-view'
import { useState } from 'react'

/**
 * A care-worker's rostered week. Each event reads as a visit, travel
 * block, break, or admin task — the kind of shape Saturn is built around.
 */
function makeRoster(anchor: Date): CalendarEvent[] {
  const at = (offset: number, h: number, m: number) => {
    const d = new Date(anchor)
    d.setDate(d.getDate() + offset)
    d.setHours(h, m, 0, 0)
    return d
  }
  return [
    // Monday
    {
      id: 'm1',
      title: 'Mrs Patel · Personal care',
      start: at(0, 7, 30),
      end: at(0, 8, 30),
      color: 'blue',
    },
    { id: 'm2', title: 'Travel', start: at(0, 8, 30), end: at(0, 9, 0), color: 'gray' },
    {
      id: 'm3',
      title: 'Mr Chen · Medication',
      start: at(0, 9, 0),
      end: at(0, 9, 45),
      color: 'green',
    },
    {
      id: 'm4',
      title: 'Mrs Okafor · Domestic',
      start: at(0, 11, 0),
      end: at(0, 12, 30),
      color: 'blue',
    },
    { id: 'm5', title: 'Lunch', start: at(0, 12, 30), end: at(0, 13, 30), color: 'amber' },
    {
      id: 'm6',
      title: 'Mr Davies · Wound care',
      start: at(0, 14, 0),
      end: at(0, 15, 0),
      color: 'pink',
    },

    // Tuesday
    {
      id: 't1',
      title: 'Mrs Patel · Personal care',
      start: at(1, 7, 30),
      end: at(1, 8, 30),
      color: 'blue',
    },
    { id: 't2', title: 'Team huddle', start: at(1, 9, 0), end: at(1, 9, 30), color: 'purple' },
    {
      id: 't3',
      title: 'Mr Davies · Wound care',
      start: at(1, 10, 0),
      end: at(1, 11, 0),
      color: 'pink',
    },
    {
      id: 't4',
      title: 'Mrs Liu · Social support',
      start: at(1, 14, 0),
      end: at(1, 15, 30),
      color: 'blue',
    },

    // Wednesday — training morning
    {
      id: 'w1',
      title: 'CPR refresher · Training',
      start: at(2, 9, 0),
      end: at(2, 12, 0),
      color: 'purple',
    },
    {
      id: 'w2',
      title: 'Mrs Okafor · Domestic',
      start: at(2, 14, 0),
      end: at(2, 15, 30),
      color: 'blue',
    },

    // Thursday
    {
      id: 'th1',
      title: 'Mr Chen · Medication',
      start: at(3, 8, 0),
      end: at(3, 8, 45),
      color: 'green',
    },
    {
      id: 'th2',
      title: 'Mrs Patel · Personal care',
      start: at(3, 9, 30),
      end: at(3, 10, 30),
      color: 'blue',
    },
    {
      id: 'th3',
      title: 'Mr Davies · Wound care',
      start: at(3, 11, 0),
      end: at(3, 12, 0),
      color: 'pink',
    },
    { id: 'th4', title: 'Lunch', start: at(3, 12, 30), end: at(3, 13, 30), color: 'amber' },
    {
      id: 'th5',
      title: 'Mrs Liu · Social support',
      start: at(3, 14, 0),
      end: at(3, 15, 0),
      color: 'blue',
    },

    // Friday
    {
      id: 'f1',
      title: 'Mrs Patel · Personal care',
      start: at(4, 7, 30),
      end: at(4, 8, 30),
      color: 'blue',
    },
    {
      id: 'f2',
      title: 'Mr Chen · Medication',
      start: at(4, 9, 0),
      end: at(4, 9, 45),
      color: 'green',
    },
    {
      id: 'f3',
      title: 'Mrs Okafor · Domestic',
      start: at(4, 10, 30),
      end: at(4, 12, 0),
      color: 'blue',
    },
    {
      id: 'f4',
      title: 'Handover · Branch office',
      start: at(4, 16, 0),
      end: at(4, 17, 0),
      color: 'purple',
    },
  ]
}

export function WeekViewDemo() {
  const [date, setDate] = useState(() => new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(() => makeRoster(new Date()))

  return (
    <WeekView
      date={date}
      onDateChange={setDate}
      events={events}
      onEventClick={(e) => console.log('visit clicked', e)}
      onEventMove={(event, newStart, newEnd) => {
        setEvents((current) =>
          current.map((e) => (e.id === event.id ? { ...e, start: newStart, end: newEnd } : e)),
        )
      }}
      onEventResize={(event, newStart, newEnd) => {
        setEvents((current) =>
          current.map((e) => (e.id === event.id ? { ...e, start: newStart, end: newEnd } : e)),
        )
      }}
      onEventCreate={(start, end) => {
        setEvents((current) => [
          ...current,
          {
            id: `new-${Date.now()}`,
            title: 'New visit',
            start,
            end,
            color: 'blue',
          },
        ])
      }}
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
