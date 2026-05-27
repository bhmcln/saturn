'use client'

import { type CalendarEvent, YearView } from '@/registry/default/ui/year-view'
import { useState } from 'react'

/** Sprinkle events across the year so the heatmap actually shows variation. */
function makeEvents(year: number): CalendarEvent[] {
  const events: CalendarEvent[] = []
  let id = 0
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      // Some randomness, weighted toward weekdays.
      const dow = new Date(year, month, day).getDay()
      const isWeekend = dow === 0 || dow === 6
      const seed = (day * 31 + month * 17) % 11
      const count = isWeekend ? Math.max(0, seed - 8) : Math.min(6, Math.max(0, seed - 4))
      for (let i = 0; i < count; i++) {
        const start = new Date(year, month, day, 8 + i, 0)
        const end = new Date(year, month, day, 9 + i, 0)
        events.push({ id: `e${id++}`, start, end })
      }
    }
  }
  return events
}

export function YearViewDemo() {
  const [year, setYear] = useState(() => new Date().getFullYear())
  const events = makeEvents(year)
  return (
    <YearView year={year} events={events} onYearChange={setYear}>
      <YearView.Header>
        <YearView.Title />
        <YearView.Navigation />
      </YearView.Header>
      <YearView.Grid />
    </YearView>
  )
}
