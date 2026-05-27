'use client'

import { Plus } from 'lucide-react'
import * as React from 'react'

import type { WeekStartsOn } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'
import { Button } from '@/registry/default/ui/button'
import type { EventColor } from '@/registry/default/ui/event-card'
import { type CalendarEvent, WeekView } from '@/registry/default/ui/week-view'

export type Appointment = CalendarEvent

export interface AppointmentCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Any date within the visible week. */
  date: Date
  appointments: Appointment[]
  weekStartsOn?: WeekStartsOn
  onDateChange?: (date: Date) => void
  onAppointmentClick?: (appointment: Appointment) => void
  /** Enable drag-to-reschedule on the grid. */
  onAppointmentMove?: (appointment: Appointment, newStart: Date, newEnd: Date) => void
  /** Enable edge resize on each appointment. */
  onAppointmentResize?: (appointment: Appointment, newStart: Date, newEnd: Date) => void
  /** Enable drag-to-create on empty grid (and reveals the + New button). */
  onAppointmentCreate?: (start: Date, end: Date) => void
  /** Override the + New button's click handler — useful for opening a modal. */
  onAddClick?: () => void
  /** Optional default color for new appointments created via drag. Default 'blue'. */
  defaultColor?: EventColor
}

export function AppointmentCalendar({
  date,
  appointments,
  weekStartsOn = 0,
  onDateChange,
  onAppointmentClick,
  onAppointmentMove,
  onAppointmentResize,
  onAppointmentCreate,
  onAddClick,
  defaultColor: _defaultColor,
  className,
  ...props
}: AppointmentCalendarProps) {
  const handleAdd = React.useCallback(() => {
    if (onAddClick) {
      onAddClick()
      return
    }
    if (onAppointmentCreate) {
      const start = new Date(date)
      start.setHours(9, 0, 0, 0)
      const end = new Date(start)
      end.setHours(10, 0, 0, 0)
      onAppointmentCreate(start, end)
    }
  }, [date, onAddClick, onAppointmentCreate])

  const showAdd = Boolean(onAddClick || onAppointmentCreate)

  return (
    <WeekView
      date={date}
      events={appointments}
      weekStartsOn={weekStartsOn}
      onDateChange={onDateChange}
      onEventClick={onAppointmentClick}
      onEventMove={onAppointmentMove}
      onEventResize={onAppointmentResize}
      onEventCreate={onAppointmentCreate}
      className={cn(className)}
      {...props}
    >
      <WeekView.Header>
        <div className="flex items-baseline gap-2">
          <WeekView.Title />
          <span className="text-xs text-muted-foreground tabular-nums">
            <span className="font-medium text-foreground">{appointments.length}</span>{' '}
            {appointments.length === 1 ? 'appointment' : 'appointments'}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {showAdd && (
            <Button size="sm" onClick={handleAdd} className="hidden sm:flex">
              <Plus className="size-4" />
              New
            </Button>
          )}
          <WeekView.Navigation />
        </div>
      </WeekView.Header>
      <WeekView.Body>
        <WeekView.DayLabels />
        <WeekView.Grid />
      </WeekView.Body>
    </WeekView>
  )
}
