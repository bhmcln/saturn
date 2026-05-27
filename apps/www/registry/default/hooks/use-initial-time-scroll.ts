import * as React from 'react'

export interface UseInitialTimeScrollOptions {
  /**
   * Ref to an element inside the scroll container. The hook walks up to
   * find the nearest scrollable ancestor and scrolls *that*, so consumers
   * don't have to thread refs through nested compound layouts.
   */
  ref: React.RefObject<HTMLElement | null>
  /** Time of day (in minutes since midnight) to scroll to. Default 8 × 60 = 8 AM. */
  targetMinutes?: number
  /** Set false to skip the scroll (e.g. for an externally-controlled position). */
  enabled?: boolean
}

function findScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let cursor: HTMLElement | null = el?.parentElement ?? null
  while (cursor) {
    const cs = getComputedStyle(cursor)
    if (/(auto|scroll)/.test(cs.overflowY) && cursor.scrollHeight > cursor.clientHeight) {
      return cursor
    }
    cursor = cursor.parentElement
  }
  return null
}

/**
 * On first mount only, scroll the nearest scrollable ancestor of
 * `ref.current` so a specific time-of-day lines up near the top of the
 * viewport. Skips re-firing on subsequent renders so user-initiated
 * scrolling and date navigation aren't clobbered.
 */
export function useInitialTimeScroll({
  ref,
  targetMinutes = 8 * 60,
  enabled = true,
}: UseInitialTimeScrollOptions): void {
  const didScrollRef = React.useRef(false)

  React.useEffect(() => {
    if (!enabled || didScrollRef.current) return
    if (!ref.current) return

    const scrollEl = findScrollableAncestor(ref.current)
    if (!scrollEl) return
    if (scrollEl.scrollHeight <= scrollEl.clientHeight) return

    didScrollRef.current = true
    const fraction = Math.min(1, Math.max(0, targetMinutes / (24 * 60)))
    scrollEl.scrollTop = fraction * scrollEl.scrollHeight
  }, [ref, targetMinutes, enabled])
}
