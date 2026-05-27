import type { ReactNode } from 'react'
import { ActivityBlockDemo } from './activity-block-demo'
import { AgendaViewDemo } from './agenda-view-demo'
import { AvailabilityOverlayDemo } from './availability-overlay-demo'
import { ButtonDemo } from './button-demo'
import { DatePickerDemo } from './date-picker-demo'
import { DateRangePickerDemo } from './date-range-picker-demo'
import { DayLabelsDemo } from './day-labels-demo'
import { DayViewDemo } from './day-view-demo'
import { EventCardDemo } from './event-card-demo'
import { MiniCalendarDemo } from './mini-calendar-demo'
import { MonthViewDemo } from './month-view-demo'
import { NowIndicatorDemo } from './now-indicator-demo'
import { PeriodBoundaryMarkerDemo } from './period-boundary-marker-demo'
import { PeriodNavigatorDemo } from './period-navigator-demo'
import { ResourceRowDemo } from './resource-row-demo'
import { SwimlaneViewDemo } from './swimlane-view-demo'
import { TimeGutterDemo } from './time-gutter-demo'
import { TimePickerDemo } from './time-picker-demo'
import { TimelineViewDemo } from './timeline-view-demo'
import { TooltipDemo } from './tooltip-demo'
import { ViewModeSwitcherDemo } from './view-mode-switcher-demo'
import { WeekViewDemo } from './week-view-demo'
import { ZoomControlsDemo } from './zoom-controls-demo'

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
  tooltip: { element: <TooltipDemo />, filename: 'tooltip-demo.tsx' },
  'time-gutter': { element: <TimeGutterDemo />, filename: 'time-gutter-demo.tsx' },
  'day-labels': { element: <DayLabelsDemo />, filename: 'day-labels-demo.tsx' },
  'activity-block': { element: <ActivityBlockDemo />, filename: 'activity-block-demo.tsx' },
  'availability-overlay': {
    element: <AvailabilityOverlayDemo />,
    filename: 'availability-overlay-demo.tsx',
  },
  'zoom-controls': { element: <ZoomControlsDemo />, filename: 'zoom-controls-demo.tsx' },
  'period-boundary-marker': {
    element: <PeriodBoundaryMarkerDemo />,
    filename: 'period-boundary-marker-demo.tsx',
  },

  'week-view': {
    element: <WeekViewDemo />,
    filename: 'week-view-demo.tsx',
    previewClassName: 'block h-[640px] p-0 min-h-0',
  },
  'day-view': {
    element: <DayViewDemo />,
    filename: 'day-view-demo.tsx',
    previewClassName: 'block h-[640px] p-0 min-h-0',
  },
  'month-view': {
    element: <MonthViewDemo />,
    filename: 'month-view-demo.tsx',
    previewClassName: 'block h-[640px] p-0 min-h-0',
  },
  'agenda-view': {
    element: <AgendaViewDemo />,
    filename: 'agenda-view-demo.tsx',
    previewClassName: 'block h-[560px] p-0 min-h-0',
  },
  'period-navigator': {
    element: <PeriodNavigatorDemo />,
    filename: 'period-navigator-demo.tsx',
  },
  'timeline-view': {
    element: <TimelineViewDemo />,
    filename: 'timeline-view-demo.tsx',
    previewClassName: 'block h-[520px] p-0 min-h-0',
  },
  'resource-row': {
    element: <ResourceRowDemo />,
    filename: 'resource-row-demo.tsx',
    previewClassName: 'block h-[220px] p-0 min-h-0',
  },
  'swimlane-view': {
    element: <SwimlaneViewDemo />,
    filename: 'swimlane-view-demo.tsx',
    previewClassName: 'block h-[520px] p-0 min-h-0',
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
