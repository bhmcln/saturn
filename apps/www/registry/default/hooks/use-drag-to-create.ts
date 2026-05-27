import * as React from 'react'

export interface DragRange {
  start: Date
  end: Date
}

export interface UseDragToCreateOptions {
  /**
   * Convert a point (relative to the container the handler is attached to)
   * into the Date it represents in the view's coordinate system. Saturn's
   * vertical-time views convert y to time, horizontal-time views convert x
   * to time, etc.
   */
  pointToDate: (point: { x: number; y: number }) => Date
  /** Fires on pointer-up with the proposed range. */
  onCreate: (start: Date, end: Date) => void
  /** Fires during the drag with the live (snapped) range. Wire to a ghost block. */
  onDrag?: (start: Date, end: Date) => void
  /** Snap both endpoints to this minute increment. Default 15. */
  snapMinutes?: number
  /** Pixel distance before the create gesture begins. Default 4. */
  thresholdPx?: number
  /** Minimum duration (ms) to actually create. Shorter drags are ignored. */
  minDurationMs?: number
  disabled?: boolean
}

export interface UseDragToCreateReturn {
  /** Live preview range during drag. Null between gestures. */
  preview: DragRange | null
  /** Spread onto the container that should accept create gestures. */
  handlers: {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
  }
}

/**
 * Pointer-down on the container background + drag to define a new event.
 * Ignores pointer-down on child elements (so existing event chips remain
 * clickable). On pointer-up, fires `onCreate(start, end)` if the snapped
 * range is at least `minDurationMs` long.
 *
 * Use the returned `preview` to render a ghost block during the drag.
 */
export function useDragToCreate({
  pointToDate,
  onCreate,
  onDrag,
  snapMinutes = 15,
  thresholdPx = 4,
  minDurationMs = 5 * 60 * 1000,
  disabled,
}: UseDragToCreateOptions): UseDragToCreateReturn {
  const [preview, setPreview] = React.useState<DragRange | null>(null)

  const pointToDateRef = React.useRef(pointToDate)
  const onCreateRef = React.useRef(onCreate)
  const onDragRef = React.useRef(onDrag)
  React.useEffect(() => {
    pointToDateRef.current = pointToDate
    onCreateRef.current = onCreate
    onDragRef.current = onDrag
  })

  const startPointRef = React.useRef<{ x: number; y: number } | null>(null)
  const containerRef = React.useRef<HTMLElement | null>(null)
  const armedRef = React.useRef(false)
  const previewRef = React.useRef<DragRange | null>(null)

  const snap = snapMinutes * 60 * 1000
  const snapDate = React.useCallback(
    (d: Date) => new Date(Math.round(d.getTime() / snap) * snap),
    [snap],
  )

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled) return
      if (event.button !== 0) return
      // Ignore pointer-down on child elements (existing events, etc.).
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      startPointRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
      containerRef.current = event.currentTarget
      armedRef.current = true
    },
    [disabled],
  )

  React.useEffect(() => {
    if (disabled) return

    const reset = () => {
      startPointRef.current = null
      containerRef.current = null
      armedRef.current = false
      previewRef.current = null
      setPreview(null)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!armedRef.current || !startPointRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const dx = x - startPointRef.current.x
      const dy = y - startPointRef.current.y
      if (previewRef.current === null && Math.hypot(dx, dy) < thresholdPx) return

      const startDate = snapDate(pointToDateRef.current(startPointRef.current))
      const endDate = snapDate(pointToDateRef.current({ x, y }))
      const next: DragRange =
        startDate <= endDate
          ? { start: startDate, end: endDate }
          : { start: endDate, end: startDate }
      previewRef.current = next
      setPreview(next)
      onDragRef.current?.(next.start, next.end)
    }

    const onPointerUp = () => {
      const finalPreview = previewRef.current
      if (
        finalPreview &&
        finalPreview.end.getTime() - finalPreview.start.getTime() >= minDurationMs
      ) {
        onCreateRef.current(finalPreview.start, finalPreview.end)
      }
      reset()
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('pointercancel', onPointerUp)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('pointercancel', onPointerUp)
    }
  }, [snapDate, thresholdPx, minDurationMs, disabled])

  return { preview, handlers: { onPointerDown } }
}
