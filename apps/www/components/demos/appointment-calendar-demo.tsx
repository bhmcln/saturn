'use client'

import {
  type Appointment,
  AppointmentCalendar,
} from '@/registry/default/blocks/appointment-calendar'
import { useState } from 'react'

function makeAppointments(anchor: Date): Appointment[] {
  const at = (offset: number, h: number, m: number): Date => {
    const d = new Date(anchor)
    d.setDate(d.getDate() + offset)
    d.setHours(h, m, 0, 0)
    return d
  }
  return [
    { id: 'a1', title: 'Standup', start: at(0, 9, 0), end: at(0, 9, 15), color: 'blue' },
    { id: 'a2', title: 'Design review', start: at(0, 10, 30), end: at(0, 11, 30), color: 'purple' },
    { id: 'a3', title: 'Lunch w/ Priya', start: at(0, 12, 30), end: at(0, 13, 30), color: 'amber' },
    { id: 'a4', title: '1:1 — Marcus', start: at(0, 15, 0), end: at(0, 15, 30), color: 'green' },
    { id: 'a5', title: 'Standup', start: at(1, 9, 0), end: at(1, 9, 15), color: 'blue' },
    {
      id: 'a6',
      title: 'Roadmap planning',
      start: at(1, 10, 0),
      end: at(1, 12, 0),
      color: 'purple',
    },
    {
      id: 'a7',
      title: 'Customer call · Acme',
      start: at(1, 14, 0),
      end: at(1, 15, 0),
      color: 'pink',
    },
    { id: 'a8', title: 'Focus block', start: at(2, 9, 0), end: at(2, 12, 0), color: 'gray' },
    { id: 'a9', title: 'Lunch', start: at(2, 12, 30), end: at(2, 13, 30), color: 'amber' },
    {
      id: 'a10',
      title: 'Demo — Q2 features',
      start: at(2, 14, 0),
      end: at(2, 15, 0),
      color: 'green',
    },
    { id: 'a11', title: 'Standup', start: at(3, 9, 0), end: at(3, 9, 15), color: 'blue' },
    {
      id: 'a12',
      title: 'Interview · Frontend',
      start: at(3, 11, 0),
      end: at(3, 12, 0),
      color: 'pink',
    },
    {
      id: 'a13',
      title: 'Team offsite prep',
      start: at(3, 14, 0),
      end: at(3, 16, 0),
      color: 'purple',
    },
    { id: 'a14', title: 'Standup', start: at(4, 9, 0), end: at(4, 9, 15), color: 'blue' },
    { id: 'a15', title: 'Code review', start: at(4, 10, 0), end: at(4, 11, 0), color: 'green' },
    { id: 'a16', title: 'Lunch', start: at(4, 12, 30), end: at(4, 13, 30), color: 'amber' },
    { id: 'a17', title: 'Retro', start: at(4, 15, 0), end: at(4, 16, 0), color: 'purple' },
  ]
}

export function AppointmentCalendarDemo() {
  const [date, setDate] = useState(() => new Date())
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    makeAppointments(new Date()),
  )

  const update = (id: string, start: Date, end: Date) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, start, end } : a)))
  }

  return (
    <AppointmentCalendar
      date={date}
      onDateChange={setDate}
      appointments={appointments}
      onAppointmentClick={(a) => console.log('clicked', a.id)}
      onAppointmentMove={(a, start, end) => update(a.id, start, end)}
      onAppointmentResize={(a, start, end) => update(a.id, start, end)}
      onAppointmentCreate={(start, end) => {
        setAppointments((prev) => [
          ...prev,
          { id: `new-${Date.now()}`, title: 'New appointment', start, end, color: 'blue' },
        ])
      }}
    />
  )
}
