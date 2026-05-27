import * as React from 'react'

export interface PositionedRange {
  /** Offset from viewport start, as a percentage (0–100). */
  offsetPct: number
  /** Length of the range within the viewport, as a percentage (0–100). */
  lengthPct: number
}

/**
 * Map an event's [start, end] range onto offset%/length% values within a
 * containing viewport's [viewportStart, viewportEnd]. Events extending
 * before or after the viewport are clamped, so widget positioning math
 * (left / width on a horizontal timeline, top / height on a vertical one)
 * is always a single multiplication.
 */
export function positionRange(
  start: Date,
  end: Date,
  viewportStart: Date,
  viewportEnd: Date,
): PositionedRange {
  const viewportMs = viewportEnd.getTime() - viewportStart.getTime()
  if (viewportMs <= 0) return { offsetPct: 0, lengthPct: 0 }
  const clampedStart = Math.max(start.getTime(), viewportStart.getTime())
  const clampedEnd = Math.min(end.getTime(), viewportEnd.getTime())
  const offsetMs = clampedStart - viewportStart.getTime()
  const lengthMs = Math.max(0, clampedEnd - clampedStart)
  return {
    offsetPct: (offsetMs / viewportMs) * 100,
    lengthPct: (lengthMs / viewportMs) * 100,
  }
}

export interface UseTimeGridOptions {
  viewportStart: Date
  viewportEnd: Date
}

export interface UseTimeGridReturn {
  position: (start: Date, end: Date) => PositionedRange
  viewportStart: Date
  viewportEnd: Date
  viewportMs: number
}

/**
 * Returns a stable `position` function bound to a fixed viewport, plus the
 * viewport bounds. Pass one of these to a TimelineView so every event in
 * its body uses the same coordinate space without recomputing it per item.
 */
export function useTimeGrid({
  viewportStart,
  viewportEnd,
}: UseTimeGridOptions): UseTimeGridReturn {
  return React.useMemo(
    () => ({
      position: (start, end) => positionRange(start, end, viewportStart, viewportEnd),
      viewportStart,
      viewportEnd,
      viewportMs: viewportEnd.getTime() - viewportStart.getTime(),
    }),
    [viewportStart, viewportEnd],
  )
}
