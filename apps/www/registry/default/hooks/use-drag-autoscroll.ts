import * as React from 'react'

export interface UseDragAutoscrollOptions {
  /** Whether a drag is currently active. The hook is a no-op when false. */
  isActive: boolean
  /**
   * A ref to an element inside the scroll container. The hook walks up
   * from this element to find the nearest scrollable ancestor and uses
   * its viewport to detect edge proximity.
   */
  ref: React.RefObject<HTMLElement | null>
  /** Pixels from the container edge at which auto-scroll kicks in. Default 48. */
  threshold?: number
  /** Maximum scroll speed (pixels per frame). Default 14. */
  maxSpeed?: number
  /** Disable horizontal auto-scroll (e.g. for purely vertical-time views). */
  disableX?: boolean
  /** Disable vertical auto-scroll (e.g. for purely horizontal timeline views). */
  disableY?: boolean
}

function findScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let cursor: HTMLElement | null = el?.parentElement ?? null
  while (cursor) {
    const cs = getComputedStyle(cursor)
    const yScrolls = /(auto|scroll)/.test(cs.overflowY) && cursor.scrollHeight > cursor.clientHeight
    const xScrolls = /(auto|scroll)/.test(cs.overflowX) && cursor.scrollWidth > cursor.clientWidth
    if (yScrolls || xScrolls) return cursor
    cursor = cursor.parentElement
  }
  return null
}

/**
 * Auto-scroll the nearest scrollable ancestor of `ref.current` while a drag
 * is in progress and the pointer is near the container's edge. Smoothly
 * accelerates as the pointer gets closer to the edge so the user feels the
 * pull without losing aim.
 */
export function useDragAutoscroll({
  isActive,
  ref,
  threshold = 48,
  maxSpeed = 14,
  disableX,
  disableY,
}: UseDragAutoscrollOptions): void {
  const pointerRef = React.useRef({ x: 0, y: 0 })

  React.useEffect(() => {
    if (!isActive) return
    const scrollEl = findScrollableAncestor(ref.current)
    if (!scrollEl) return

    let raf = 0

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const rect = scrollEl.getBoundingClientRect()
      const { x, y } = pointerRef.current

      let dy = 0
      if (!disableY) {
        const fromTop = y - rect.top
        const fromBottom = rect.bottom - y
        if (fromTop < threshold && fromTop >= 0) {
          dy = -((threshold - fromTop) / threshold) * maxSpeed
        } else if (fromBottom < threshold && fromBottom >= 0) {
          dy = ((threshold - fromBottom) / threshold) * maxSpeed
        }
      }

      let dx = 0
      if (!disableX) {
        const fromLeft = x - rect.left
        const fromRight = rect.right - x
        if (fromLeft < threshold && fromLeft >= 0) {
          dx = -((threshold - fromLeft) / threshold) * maxSpeed
        } else if (fromRight < threshold && fromRight >= 0) {
          dx = ((threshold - fromRight) / threshold) * maxSpeed
        }
      }

      if (dy !== 0) scrollEl.scrollTop += dy
      if (dx !== 0) scrollEl.scrollLeft += dx

      raf = requestAnimationFrame(tick)
    }

    document.addEventListener('pointermove', onPointerMove)
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(raf)
    }
  }, [isActive, ref, threshold, maxSpeed, disableX, disableY])
}
