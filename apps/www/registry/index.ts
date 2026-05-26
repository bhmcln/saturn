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
  {
    name: 'event-card',
    type: 'registry:ui',
    description: 'Variant-driven event chip rendered inside calendar grids',
    files: [{ path: 'ui/event-card.tsx', type: 'registry:ui' }],
    dependencies: ['class-variance-authority'],
    registryDependencies: ['utils'],
  },
  {
    name: 'week-view',
    type: 'registry:ui',
    description: 'Seven-day calendar view with time grid and positioned events',
    files: [{ path: 'ui/week-view.tsx', type: 'registry:ui' }],
    dependencies: ['date-fns', 'lucide-react'],
    registryDependencies: ['utils', 'time', 'event-card'],
  },
]
