import type { RegistryItemType } from '@saturn/registry-schema'

/**
 * Manifest of registry items. The build script reads file contents off disk
 * and emits one JSON file per item to public/r/<name>.json.
 *
 * `files[].path` is relative to `apps/www/registry/default/`.
 */
export interface ManifestItem {
  name: string
  type: RegistryItemType
  description?: string
  files: { path: string; type: RegistryItemType }[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
}

export const registry: ManifestItem[] = [
  // ─── Foundations (lib) ──────────────────────────────────────────────────
  {
    name: 'utils',
    type: 'registry:lib',
    description: 'cn() — class-name merger combining clsx and tailwind-merge',
    files: [{ path: 'lib/utils.ts', type: 'registry:lib' }],
    dependencies: ['clsx', 'tailwind-merge'],
  },
  {
    name: 'time',
    type: 'registry:lib',
    description: 'date-fns helpers for week/month grids and hour formatting',
    files: [{ path: 'lib/time.ts', type: 'registry:lib' }],
    dependencies: ['date-fns'],
  },

  // ─── Foundations (hooks) ────────────────────────────────────────────────
  {
    name: 'use-controllable',
    type: 'registry:hook',
    description: 'useState replacement that also supports a controlled `value` prop',
    files: [{ path: 'hooks/use-controllable.ts', type: 'registry:hook' }],
  },
  {
    name: 'use-now',
    type: 'registry:hook',
    description: 'Returns a Date that auto-refreshes every N ms — backs now-indicators',
    files: [{ path: 'hooks/use-now.ts', type: 'registry:hook' }],
  },
  {
    name: 'use-event-layout',
    type: 'registry:hook',
    description: 'Column-packs overlapping events into the minimum number of side-by-side columns',
    files: [{ path: 'hooks/use-event-layout.ts', type: 'registry:hook' }],
  },

  // ─── Primitives (ui) ────────────────────────────────────────────────────
  {
    name: 'button',
    type: 'registry:ui',
    description:
      'cva-driven Button with six variants and four sizes; supports asChild for composition',
    files: [{ path: 'ui/button.tsx', type: 'registry:ui' }],
    dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
    registryDependencies: ['utils'],
  },
  {
    name: 'event-card',
    type: 'registry:ui',
    description: 'Variant-driven event chip rendered inside calendar grids',
    files: [{ path: 'ui/event-card.tsx', type: 'registry:ui' }],
    dependencies: ['class-variance-authority'],
    registryDependencies: ['utils'],
  },
  {
    name: 'now-indicator',
    type: 'registry:ui',
    description: 'Horizontal current-time line + dot, auto-refreshing every minute',
    files: [{ path: 'ui/now-indicator.tsx', type: 'registry:ui' }],
    registryDependencies: ['utils', 'time', 'use-now'],
  },
  {
    name: 'view-mode-switcher',
    type: 'registry:ui',
    description: 'Radix DropdownMenu for picking between day/week/month/agenda/timeline modes',
    files: [{ path: 'ui/view-mode-switcher.tsx', type: 'registry:ui' }],
    dependencies: ['@radix-ui/react-dropdown-menu', 'lucide-react'],
    registryDependencies: ['utils'],
  },
  {
    name: 'mini-calendar',
    type: 'registry:ui',
    description: 'react-day-picker wrapper themed with Saturn tokens — single, range, multi modes',
    files: [{ path: 'ui/mini-calendar.tsx', type: 'registry:ui' }],
    dependencies: ['react-day-picker', 'lucide-react'],
    registryDependencies: ['utils', 'button'],
  },
  {
    name: 'tooltip',
    type: 'registry:ui',
    description:
      'Radix-based tooltip with TooltipProvider, Tooltip, TooltipTrigger, TooltipContent',
    files: [{ path: 'ui/tooltip.tsx', type: 'registry:ui' }],
    dependencies: ['@radix-ui/react-tooltip'],
    registryDependencies: ['utils'],
  },

  // ─── Views (ui) ─────────────────────────────────────────────────────────
  {
    name: 'week-view',
    type: 'registry:ui',
    description: 'Seven-day calendar view with time grid and positioned events',
    files: [{ path: 'ui/week-view.tsx', type: 'registry:ui' }],
    dependencies: ['date-fns', 'lucide-react'],
    registryDependencies: ['utils', 'time', 'event-card', 'tooltip'],
  },
  {
    name: 'day-view',
    type: 'registry:ui',
    description: 'Single-day calendar grid with positioned events and a now-line',
    files: [{ path: 'ui/day-view.tsx', type: 'registry:ui' }],
    dependencies: ['date-fns', 'lucide-react'],
    registryDependencies: ['utils', 'time', 'event-card', 'tooltip', 'use-event-layout', 'use-now'],
  },
  {
    name: 'month-view',
    type: 'registry:ui',
    description: 'Six-week calendar grid with day cells and "+N more" overflow',
    files: [{ path: 'ui/month-view.tsx', type: 'registry:ui' }],
    dependencies: ['date-fns', 'lucide-react'],
    registryDependencies: ['utils', 'time', 'event-card', 'tooltip'],
  },
  {
    name: 'agenda-view',
    type: 'registry:ui',
    description: 'Chronological list of events grouped by day — mobile-friendly fallback',
    files: [{ path: 'ui/agenda-view.tsx', type: 'registry:ui' }],
    dependencies: ['date-fns', 'lucide-react'],
    registryDependencies: ['utils', 'event-card'],
  },
  {
    name: 'period-navigator',
    type: 'registry:ui',
    description: 'Prev/next-period buttons + popover calendar with period-boundary tinting',
    files: [{ path: 'ui/period-navigator.tsx', type: 'registry:ui' }],
    dependencies: ['@radix-ui/react-popover', 'date-fns', 'lucide-react'],
    registryDependencies: ['utils', 'button', 'mini-calendar'],
  },

  // ─── Inputs (ui) ────────────────────────────────────────────────────────
  {
    name: 'date-picker',
    type: 'registry:ui',
    description: 'Single-date popover input composing mini-calendar',
    files: [{ path: 'ui/date-picker.tsx', type: 'registry:ui' }],
    dependencies: ['@radix-ui/react-popover', 'date-fns', 'lucide-react'],
    registryDependencies: ['utils', 'button', 'mini-calendar', 'use-controllable'],
  },
  {
    name: 'date-range-picker',
    type: 'registry:ui',
    description: 'Two-month date-range popover input',
    files: [{ path: 'ui/date-range-picker.tsx', type: 'registry:ui' }],
    dependencies: ['@radix-ui/react-popover', 'date-fns', 'lucide-react', 'react-day-picker'],
    registryDependencies: ['utils', 'button', 'mini-calendar', 'use-controllable'],
  },
  {
    name: 'time-picker',
    type: 'registry:ui',
    description: 'HH:MM input with a step prop for minute increments',
    files: [{ path: 'ui/time-picker.tsx', type: 'registry:ui' }],
    dependencies: ['lucide-react'],
    registryDependencies: ['utils', 'use-controllable'],
  },
]
