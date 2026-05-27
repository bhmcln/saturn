import type * as React from 'react'
import { useEventDrag } from '@/registry/default/hooks/use-event-drag'

export interface UseEventResizeOptions {
  /**
   * Which edge of the event the handle controls. Informational only — the
   * caller decides whether to apply the returned delta to `start` (top edge)
   * or `end` (bottom edge).
   */
  edge: 'top' | 'bottom'
  /** Convert pixel delta to milliseconds for this view's geometry. */
  getDelta: (dx: number, dy: number) => number
  /** Called on pointer-up with the final snapped delta. */
  onResize: (deltaMs: number) => void
  /** Called during drag with live snapped delta — wire to a ghost preview. */
  onDragging?: (deltaMs: number) => void
  snapMinutes?: number
  thresholdPx?: number
  disabled?: boolean
}

export interface UseEventResizeReturn {
  isResizing: boolean
  handlers: {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
  }
}

/**
 * Thin wrapper around use-event-drag that renames the surface for the
 * resize-handle use case (top / bottom edge of an event block). Same
 * pointer-events plumbing, snap-to-minutes, and threshold; the caller
 * decides which endpoint of the event the returned delta applies to.
 */
export function useEventResize(opts: UseEventResizeOptions): UseEventResizeReturn {
  const drag = useEventDrag({
    getDelta: opts.getDelta,
    onMove: opts.onResize,
    onDrag: opts.onDragging,
    snapMinutes: opts.snapMinutes,
    thresholdPx: opts.thresholdPx,
    disabled: opts.disabled,
  })
  return { isResizing: drag.isDragging, handlers: drag.handlers }
}
