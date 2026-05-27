import * as React from 'react'

export interface UseEventDragOptions {
  /**
   * Convert a pixel delta (dx horizontal, dy vertical) into a time delta in
   * milliseconds for this view's geometry. The hook is orientation-agnostic;
   * the caller knows whether vertical = time (week-view) or horizontal = time
   * (timeline-view).
   */
  getDelta: (dx: number, dy: number) => number
  /** Called on pointer-up with the final snapped delta. */
  onMove: (deltaMs: number) => void
  /** Called during drag with the live (snapped) delta — wire to a ghost preview. */
  onDrag?: (deltaMs: number) => void
  /** Snap the delta to this minute increment. Default 15. */
  snapMinutes?: number
  /** Pixel distance the pointer must move before drag starts (avoids click vs drag). Default 4. */
  thresholdPx?: number
  disabled?: boolean
}

export interface UseEventDragReturn {
  isDragging: boolean
  /** Spread onto the draggable element. */
  handlers: {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
  }
}

/**
 * Pointer-events drag handler that emits time deltas snapped to a minute
 * increment. Geometry-agnostic: the caller maps pixel deltas to time deltas
 * via `getDelta`, which lets the same hook power vertical drags in week/day
 * views and horizontal drags in timeline-view.
 */
export function useEventDrag({
  getDelta,
  onMove,
  onDrag,
  snapMinutes = 15,
  thresholdPx = 4,
  disabled,
}: UseEventDragOptions): UseEventDragReturn {
  const [isDragging, setIsDragging] = React.useState(false)

  const getDeltaRef = React.useRef(getDelta)
  const onMoveRef = React.useRef(onMove)
  const onDragRef = React.useRef(onDrag)
  React.useEffect(() => {
    getDeltaRef.current = getDelta
    onMoveRef.current = onMove
    onDragRef.current = onDrag
  })

  const startRef = React.useRef<{ x: number; y: number } | null>(null)
  const armedRef = React.useRef(false)

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled) return
      if (event.button !== 0) return
      startRef.current = { x: event.clientX, y: event.clientY }
      armedRef.current = true
    },
    [disabled],
  )

  React.useEffect(() => {
    if (disabled) return

    const snap = snapMinutes * 60 * 1000

    const computeSnapped = (event: PointerEvent): number | null => {
      if (!startRef.current) return null
      const dx = event.clientX - startRef.current.x
      const dy = event.clientY - startRef.current.y
      const raw = getDeltaRef.current(dx, dy)
      return Math.round(raw / snap) * snap
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!startRef.current) return
      const dx = event.clientX - startRef.current.x
      const dy = event.clientY - startRef.current.y
      if (!armedRef.current) return
      if (!isDragging && Math.hypot(dx, dy) < thresholdPx) return
      if (!isDragging) setIsDragging(true)
      const snapped = computeSnapped(event)
      if (snapped !== null) onDragRef.current?.(snapped)
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!startRef.current) return
      const wasDragging = isDragging
      const snapped = computeSnapped(event)
      startRef.current = null
      armedRef.current = false
      setIsDragging(false)
      if (wasDragging && snapped !== null && snapped !== 0) {
        onMoveRef.current(snapped)
      }
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('pointercancel', onPointerUp)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('pointercancel', onPointerUp)
    }
  }, [isDragging, snapMinutes, thresholdPx, disabled])

  return {
    isDragging,
    handlers: { onPointerDown },
  }
}
