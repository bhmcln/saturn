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
    ],
  },
  {
    title: 'Hooks',
    items: [
      { title: 'useControllableState', href: '/docs/use-controllable' },
      { title: 'useNow', href: '/docs/use-now' },
      { title: 'useEventLayout', href: '/docs/use-event-layout' },
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
