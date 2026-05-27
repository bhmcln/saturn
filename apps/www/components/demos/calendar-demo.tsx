'use client'

import { AgendaView } from '@/registry/default/ui/agenda-view'
import { DayView } from '@/registry/default/ui/day-view'
import { MonthView } from '@/registry/default/ui/month-view'
import { type ViewMode, ViewModeSwitcher } from '@/registry/default/ui/view-mode-switcher'
import { type CalendarEvent, WeekView } from '@/registry/default/ui/week-view'
import { useState } from 'react'

/**
 * A care-worker's rostered week, used as the landing-page demo. The same
 * events render across day / week / month / agenda views via the toggle.
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
      title: 'Mrs Patel · Personal care',
      start: at(1, 7, 30),
      end: at(1, 8, 30),
      color: 'blue',
    },
    { id: '7', title: 'Team huddle', start: at(1, 9, 0), end: at(1, 9, 30), color: 'purple' },
    {
      id: '8',
      title: 'Mr Davies · Wound care',
      start: at(1, 10, 0),
      end: at(1, 11, 0),
      color: 'pink',
    },
    {
      id: '9',
      title: 'Mrs Liu · Social support',
      start: at(1, 14, 0),
      end: at(1, 15, 30),
      color: 'blue',
    },

    {
      id: '10',
      title: 'CPR refresher · Training',
      start: at(2, 9, 0),
      end: at(2, 12, 0),
      color: 'purple',
    },
    {
      id: '11',
      title: 'Mrs Okafor · Domestic',
      start: at(2, 14, 0),
      end: at(2, 15, 30),
      color: 'blue',
    },

    {
      id: '12',
      title: 'Mr Chen · Medication',
      start: at(3, 8, 0),
      end: at(3, 8, 45),
      color: 'green',
    },
    {
      id: '13',
      title: 'Mrs Patel · Personal care',
      start: at(3, 9, 30),
      end: at(3, 10, 30),
      color: 'blue',
    },
    {
      id: '14',
      title: 'Mr Davies · Wound care',
      start: at(3, 11, 0),
      end: at(3, 12, 0),
      color: 'pink',
    },

    {
      id: '15',
      title: 'Mrs Patel · Personal care',
      start: at(4, 7, 30),
      end: at(4, 8, 30),
      color: 'blue',
    },
    {
      id: '16',
      title: 'Mr Chen · Medication',
      start: at(4, 9, 0),
      end: at(4, 9, 45),
      color: 'green',
    },
    {
      id: '17',
      title: 'Handover · Branch office',
      start: at(4, 16, 0),
      end: at(4, 17, 0),
      color: 'purple',
    },
  ]
}

const VIEWS: ViewMode[] = ['day', 'week', 'month', 'agenda']

export function CalendarDemo() {
  const [date, setDate] = useState(() => new Date())
  const [view, setView] = useState<ViewMode>('week')
  const events = makeRoster(date)

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
