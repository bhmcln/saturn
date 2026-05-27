'use client'

import { AgendaView, type CalendarEvent } from '@/registry/default/ui/agenda-view'
import { useState } from 'react'

/**
 * Today's run, plus the next few days — the view a care worker would open
 * on their phone first thing in the morning.
 */
function makeRoster(anchor: Date): CalendarEvent[] {
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
      start: at(0, 14, 0),
      end: at(0, 15, 0),
      color: 'pink',
    },
    {
      id: '6',
      title: 'Mrs Liu · Social support',
      start: at(1, 14, 0),
      end: at(1, 15, 30),
      color: 'blue',
    },
    {
      id: '7',
      title: 'Mr Davies · Wound care',
      start: at(1, 16, 0),
      end: at(1, 17, 0),
      color: 'pink',
    },
    {
      id: '8',
      title: 'CPR refresher · Training',
      start: at(2, 9, 0),
      end: at(2, 12, 0),
      color: 'purple',
    },
    {
      id: '9',
      title: 'Handover · Branch office',
      start: at(4, 16, 0),
      end: at(4, 17, 0),
      color: 'purple',
    },
  ]
}

export function AgendaViewDemo() {
  const [date, setDate] = useState(() => new Date())
  const events = makeRoster(date)
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
