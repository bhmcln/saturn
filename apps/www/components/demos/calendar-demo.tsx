'use client'

import { AgendaView } from '@/registry/default/ui/agenda-view'
import { DayView } from '@/registry/default/ui/day-view'
import { MonthView } from '@/registry/default/ui/month-view'
import { type ViewMode, ViewModeSwitcher } from '@/registry/default/ui/view-mode-switcher'
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
    {
      id: '7',
      title: 'Architecture review',
      start: day(5, 10, 0),
      end: day(5, 12, 0),
      color: 'green',
    },
    { id: '8', title: 'Sprint retro', start: day(-2, 16, 0), end: day(-2, 17, 0), color: 'pink' },
  ]
}

const VIEWS: ViewMode[] = ['day', 'week', 'month', 'agenda']

export function CalendarDemo() {
  const [date, setDate] = useState(() => new Date())
  const [view, setView] = useState<ViewMode>('week')
  const events = makeEvents(date)

  const switcher = <ViewModeSwitcher value={view} onValueChange={setView} views={VIEWS} />

  if (view === 'day') {
    return (
      <DayView date={date} onDateChange={setDate} events={events}>
        <DayView.Header>
          <DayView.Title />
          <div className="flex items-center gap-3">
            <DayView.Navigation />
            {switcher}
          </div>
        </DayView.Header>
        <DayView.Body>
          <DayView.Grid />
        </DayView.Body>
      </DayView>
    )
  }

  if (view === 'month') {
    return (
      <MonthView date={date} onDateChange={setDate} events={events}>
        <MonthView.Header>
          <MonthView.Title />
          <div className="flex items-center gap-3">
            <MonthView.Navigation />
            {switcher}
          </div>
        </MonthView.Header>
        <MonthView.Body>
          <MonthView.WeekdayLabels />
          <MonthView.Grid />
        </MonthView.Body>
      </MonthView>
    )
  }

  if (view === 'agenda') {
    return (
      <AgendaView date={date} onDateChange={setDate} events={events}>
        <AgendaView.Header>
          <AgendaView.Title />
          <div className="flex items-center gap-3">
            <AgendaView.Navigation />
            {switcher}
          </div>
        </AgendaView.Header>
        <AgendaView.List />
      </AgendaView>
    )
  }

  return (
    <WeekView date={date} onDateChange={setDate} events={events}>
      <WeekView.Header>
        <WeekView.Title />
        <div className="flex items-center gap-3">
          <WeekView.Navigation />
          {switcher}
        </div>
      </WeekView.Header>
      <WeekView.Body>
        <WeekView.DayLabels />
        <WeekView.Grid />
      </WeekView.Body>
    </WeekView>
  )
}
