export interface DocsNavItem {
  title: string
  href: string
}

export interface DocsNavGroup {
  title: string
  items: DocsNavItem[]
}

export const docsNav: DocsNavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
    ],
  },
  {
    title: 'Foundations',
    items: [
      { title: 'cn (utils)', href: '/docs/utils' },
      { title: 'Time helpers', href: '/docs/time' },
      { title: 'Timezone', href: '/docs/timezone' },
      { title: 'Activity colors', href: '/docs/activity-colors' },
    ],
  },
  {
    title: 'Hooks',
    items: [
      { title: 'useControllableState', href: '/docs/use-controllable' },
      { title: 'useNow', href: '/docs/use-now' },
      { title: 'useEventLayout', href: '/docs/use-event-layout' },
      { title: 'useTimeGrid', href: '/docs/use-time-grid' },
      { title: 'useZoom', href: '/docs/use-zoom' },
      { title: 'useKeyboardShortcuts', href: '/docs/use-keyboard-shortcuts' },
      { title: 'useEventDrag', href: '/docs/use-event-drag' },
      { title: 'useEventResize', href: '/docs/use-event-resize' },
      { title: 'useDragToCreate', href: '/docs/use-drag-to-create' },
      { title: 'useDragAutoscroll', href: '/docs/use-drag-autoscroll' },
      { title: 'useInitialTimeScroll', href: '/docs/use-initial-time-scroll' },
    ],
  },
  {
    title: 'Primitives',
    items: [
      { title: 'Button', href: '/docs/button' },
      { title: 'Event Card', href: '/docs/event-card' },
      { title: 'Now Indicator', href: '/docs/now-indicator' },
      { title: 'View Mode Switcher', href: '/docs/view-mode-switcher' },
      { title: 'Mini Calendar', href: '/docs/mini-calendar' },
      { title: 'Tooltip', href: '/docs/tooltip' },
      { title: 'Time Gutter', href: '/docs/time-gutter' },
      { title: 'Day Labels', href: '/docs/day-labels' },
      { title: 'Activity Block', href: '/docs/activity-block' },
      { title: 'Availability Overlay', href: '/docs/availability-overlay' },
      { title: 'Zoom Controls', href: '/docs/zoom-controls' },
      { title: 'Period Boundary Marker', href: '/docs/period-boundary-marker' },
    ],
  },
  {
    title: 'Views',
    items: [
      { title: 'Week View', href: '/docs/week-view' },
      { title: 'Day View', href: '/docs/day-view' },
      { title: 'Month View', href: '/docs/month-view' },
      { title: 'Agenda View', href: '/docs/agenda-view' },
      { title: 'Period Navigator', href: '/docs/period-navigator' },
      { title: 'Timeline View', href: '/docs/timeline-view' },
      { title: 'Resource Row', href: '/docs/resource-row' },
      { title: 'Swimlane View', href: '/docs/swimlane-view' },
      { title: 'Multi-day View', href: '/docs/multi-day-view' },
      { title: 'Year View', href: '/docs/year-view' },
    ],
  },
  {
    title: 'Inputs',
    items: [
      { title: 'Date Picker', href: '/docs/date-picker' },
      { title: 'Date Range Picker', href: '/docs/date-range-picker' },
      { title: 'Time Picker', href: '/docs/time-picker' },
    ],
  },
]
