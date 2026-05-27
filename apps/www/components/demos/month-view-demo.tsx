'use client'

import { type CalendarEvent, MonthView } from '@/registry/default/ui/month-view'
import { useState } from 'react'

/**
 * A monthly roster overview — each cell shows the day's first few visits
 * with a "+N more" overflow once a worker's day fills up.
 */
function makeRoster(anchor: Date): CalendarEvent[] {
  const at = (offset: number, h: number, m: number) => {
    const d = new Date(anchor)
    d.setDate(d.getDate() + offset)
    d.setHours(h, m, 0, 0)
    return d
  }
  const everyWeekday: CalendarEvent[] = []
  for (let week = -1; week <= 2; week++) {
    for (let dow = 0; dow < 5; dow++) {
      const offset = week * 7 + dow
      // Most days: 3–5 visits + 1 break
      everyWeekday.push(
        {
          id: `${offset}-a`,
          title: 'Mrs Patel · Personal care',
          start: at(offset, 7, 30),
          end: at(offset, 8, 30),
          color: 'blue',
        },
        {
          id: `${offset}-b`,
          title: 'Mr Chen · Medication',
          start: at(offset, 9, 0),
          end: at(offset, 9, 45),
          color: 'green',
        },
        {
          id: `${offset}-c`,
          title: 'Mrs Okafor · Domestic',
          start: at(offset, 10, 30),
          end: at(offset, 12, 0),
          color: 'blue',
        },
        {
          id: `${offset}-d`,
          title: 'Mr Davies · Wound care',
          start: at(offset, 14, 0),
          end: at(offset, 15, 0),
          color: 'pink',
        },
      )
    }
  }
  // A training day
  everyWeekday.push({
    id: 'training',
    title: 'CPR refresher · Training',
    start: at(2, 9, 0),
    end: at(2, 12, 0),
    color: 'purple',
  })
  return everyWeekday
}

export function MonthViewDemo() {
  const [date, setDate] = useState(() => new Date())
  const events = makeRoster(date)

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
