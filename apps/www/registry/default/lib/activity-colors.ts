/**
 * Activity-type colour tokens used by roster components (timeline-view,
 * resource-row, activity-block, shift-block). Each entry is a complete set
 * of Tailwind classes so consumers can drop them onto bg / border / accent
 * bar / text without rebuilding the palette each time.
 */

export type ActivityType = 'TASK' | 'TRAVEL' | 'BREAK' | 'TRAINING' | 'ADMIN' | 'UNAVAILABLE'

export interface ActivityColorSet {
  /** Background class for the block itself. */
  bg: string
  /** Border class for the block. */
  border: string
  /** Accent class (used for left-edge bars, dots, segments). */
  accent: string
  /** Foreground text class for titles. */
  title: string
  /** Foreground text class for secondary lines (time, meta). */
  meta: string
}

export const ACTIVITY_COLORS: Record<ActivityType, ActivityColorSet> = {
  TASK: {
    bg: 'bg-blue-50 dark:bg-blue-600/15',
    border: 'border-blue-200 dark:border-blue-600/30',
    accent: 'bg-blue-500',
    title: 'text-blue-700 dark:text-blue-300',
    meta: 'text-blue-500 dark:text-blue-400',
  },
  TRAVEL: {
    bg: 'bg-amber-50 dark:bg-amber-600/10',
    border: 'border-amber-200 dark:border-amber-600/30',
    accent: 'bg-amber-400',
    title: 'text-amber-700 dark:text-amber-300',
    meta: 'text-amber-500 dark:text-amber-400',
  },
  BREAK: {
    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
    border: 'border-yellow-200 dark:border-yellow-500/30',
    accent: 'bg-yellow-400',
    title: 'text-yellow-700 dark:text-yellow-300',
    meta: 'text-yellow-600 dark:text-yellow-400',
  },
  TRAINING: {
    bg: 'bg-purple-50 dark:bg-purple-600/15',
    border: 'border-purple-200 dark:border-purple-600/30',
    accent: 'bg-purple-500',
    title: 'text-purple-700 dark:text-purple-300',
    meta: 'text-purple-500 dark:text-purple-400',
  },
  ADMIN: {
    bg: 'bg-green-50 dark:bg-green-600/15',
    border: 'border-green-200 dark:border-green-600/30',
    accent: 'bg-green-500',
    title: 'text-green-700 dark:text-green-300',
    meta: 'text-green-500 dark:text-green-400',
  },
  UNAVAILABLE: {
    bg: 'bg-gray-100 dark:bg-white/5',
    border: 'border-gray-200 dark:border-white/10',
    accent: 'bg-gray-400',
    title: 'text-gray-700 dark:text-gray-400',
    meta: 'text-gray-500 dark:text-gray-500',
  },
}

/**
 * Normalize variant strings (PAID_BREAK, VISIT, etc.) onto the canonical
 * ActivityType set. Anything unrecognised falls back to TASK.
 */
export function normalizeActivityType(type: string): ActivityType {
  const upper = type.toUpperCase()
  if (upper === 'VISIT') return 'TASK'
  if (upper.includes('BREAK')) return 'BREAK'
  if (upper === 'HOME_TRAVEL') return 'TRAVEL'
  if (upper === 'IDLE') return 'UNAVAILABLE'
  const canonical = ['TASK', 'TRAVEL', 'TRAINING', 'ADMIN', 'UNAVAILABLE'] as const
  if ((canonical as readonly string[]).includes(upper)) {
    return upper as ActivityType
  }
  return 'TASK'
}

/** Full colour set for an activity type. */
export function activityColors(type: string): ActivityColorSet {
  return ACTIVITY_COLORS[normalizeActivityType(type)]
}

/** Accent class only — for left-edge bars, dots, segments. */
export function activityAccentClass(type: string): string {
  return activityColors(type).accent
}
