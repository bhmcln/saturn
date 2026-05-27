import type { ReactNode } from 'react'
import { AgendaViewDemo } from './agenda-view-demo'
import { ButtonDemo } from './button-demo'
import { DatePickerDemo } from './date-picker-demo'
import { DateRangePickerDemo } from './date-range-picker-demo'
import { DayViewDemo } from './day-view-demo'
import { EventCardDemo } from './event-card-demo'
import { MiniCalendarDemo } from './mini-calendar-demo'
import { MonthViewDemo } from './month-view-demo'
import { NowIndicatorDemo } from './now-indicator-demo'
import { PeriodNavigatorDemo } from './period-navigator-demo'
import { TimePickerDemo } from './time-picker-demo'
import { ViewModeSwitcherDemo } from './view-mode-switcher-demo'
import { WeekViewDemo } from './week-view-demo'

export interface DemoSpec {
  element: ReactNode
  /** Filename under apps/www/components/demos/ (used to read demo source). */
  filename: string
  /** Override the preview frame styling (e.g. zero padding, fixed height). */
  previewClassName?: string
}

export const DEMOS: Record<string, DemoSpec> = {
  button: { element: <ButtonDemo />, filename: 'button-demo.tsx' },
  'event-card': { element: <EventCardDemo />, filename: 'event-card-demo.tsx' },
  'now-indicator': { element: <NowIndicatorDemo />, filename: 'now-indicator-demo.tsx' },
  'view-mode-switcher': {
    element: <ViewModeSwitcherDemo />,
    filename: 'view-mode-switcher-demo.tsx',
  },
  'mini-calendar': { element: <MiniCalendarDemo />, filename: 'mini-calendar-demo.tsx' },

  'week-view': {
    element: <WeekViewDemo />,
    filename: 'week-view-demo.tsx',
    previewClassName: 'h-[640px] p-0 min-h-0',
  },
  'day-view': {
    element: <DayViewDemo />,
    filename: 'day-view-demo.tsx',
    previewClassName: 'h-[640px] p-0 min-h-0',
  },
  'month-view': {
    element: <MonthViewDemo />,
    filename: 'month-view-demo.tsx',
    previewClassName: 'h-[640px] p-0 min-h-0',
  },
  'agenda-view': {
    element: <AgendaViewDemo />,
    filename: 'agenda-view-demo.tsx',
    previewClassName: 'h-[560px] p-0 min-h-0',
  },
  'period-navigator': {
    element: <PeriodNavigatorDemo />,
    filename: 'period-navigator-demo.tsx',
  },

  'date-picker': { element: <DatePickerDemo />, filename: 'date-picker-demo.tsx' },
  'date-range-picker': {
    element: <DateRangePickerDemo />,
    filename: 'date-range-picker-demo.tsx',
  },
  'time-picker': { element: <TimePickerDemo />, filename: 'time-picker-demo.tsx' },
}

export function getDemo(name: string): DemoSpec | undefined {
  return DEMOS[name]
}
