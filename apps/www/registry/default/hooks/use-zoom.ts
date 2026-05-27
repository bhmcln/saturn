import * as React from 'react'

export interface UseZoomOptions {
  defaultZoom?: number
  min?: number
  max?: number
  /** Multiplier applied per zoomIn / zoomOut call. */
  step?: number
}

export interface UseZoomReturn {
  zoom: number
  setZoom: (zoom: number) => void
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  /** Compute and apply the zoom needed to fit `contentWidth` into `viewportWidth`. */
  fitTo: (contentWidth: number, viewportWidth: number) => void
}

/**
 * Bounded zoom state. Used by timeline-view and any horizontal-scrolling
 * surface where the consumer wants to widen or narrow the time axis.
 */
export function useZoom({
  defaultZoom = 1,
  min = 0.5,
  max = 3,
  step = 1.2,
}: UseZoomOptions = {}): UseZoomReturn {
  const [zoom, setZoomRaw] = React.useState(defaultZoom)

  const setZoom = React.useCallback(
    (next: number) => setZoomRaw(Math.min(Math.max(next, min), max)),
    [min, max],
  )

  const zoomIn = React.useCallback(() => setZoom(zoom * step), [setZoom, zoom, step])
  const zoomOut = React.useCallback(() => setZoom(zoom / step), [setZoom, zoom, step])
  const reset = React.useCallback(() => setZoom(defaultZoom), [setZoom, defaultZoom])
  const fitTo = React.useCallback(
    (contentWidth: number, viewportWidth: number) => {
      if (contentWidth <= 0) return
      setZoom(viewportWidth / contentWidth)
    },
    [setZoom],
  )

  return { zoom, setZoom, zoomIn, zoomOut, reset, fitTo }
}
