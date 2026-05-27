'use client'

import { useZoom } from '@/registry/default/hooks/use-zoom'
import { ZoomControls } from '@/registry/default/ui/zoom-controls'

export function ZoomControlsDemo() {
  const { zoom, zoomIn, zoomOut, reset, fitTo } = useZoom({ defaultZoom: 1 })

  return (
    <div className="flex flex-col items-center gap-4">
      <ZoomControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={reset}
        onFit={() => fitTo(1000, 800)}
      />
      <div className="rounded-md border bg-card p-3 text-xs text-muted-foreground tabular-nums">
        Current zoom: <span className="font-medium text-foreground">{zoom.toFixed(2)}×</span>
      </div>
    </div>
  )
}
