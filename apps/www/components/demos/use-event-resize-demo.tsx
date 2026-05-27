'use client'

import { useEventResize } from '@/registry/default/hooks/use-event-resize'
import { cn } from '@/registry/default/lib/utils'
import { useState } from 'react'

const MS_PER_PX = (60 * 1000) / 2

export function UseEventResizeDemo() {
  const [start, setStart] = useState(() => {
    const d = new Date()
    d.setHours(9, 0, 0, 0)
    return d
  })
  const [end, setEnd] = useState(() => {
    const d = new Date()
    d.setHours(11, 0, 0, 0)
    return d
  })
  const [topDelta, setTopDelta] = useState(0)
  const [bottomDelta, setBottomDelta] = useState(0)

  const resizeTop = useEventResize({
    edge: 'top',
    snapMinutes: 15,
    getDelta: (_dx, dy) => dy * MS_PER_PX,
    onDragging: setTopDelta,
    onResize(delta) {
      setTopDelta(0)
      const next = new Date(start.getTime() + delta)
      if (next < end) setStart(next)
    },
  })

  const resizeBottom = useEventResize({
    edge: 'bottom',
    snapMinutes: 15,
    getDelta: (_dx, dy) => dy * MS_PER_PX,
    onDragging: setBottomDelta,
    onResize(delta) {
      setBottomDelta(0)
      const next = new Date(end.getTime() + delta)
      if (next > start) setEnd(next)
    },
  })

  const renderedStart = new Date(start.getTime() + topDelta)
  const renderedEnd = new Date(end.getTime() + bottomDelta)
  const minutesFromTop = renderedStart.getHours() * 60 + renderedStart.getMinutes() - 6 * 60
  const durationMinutes = (renderedEnd.getTime() - renderedStart.getTime()) / 60000

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-72 w-64 overflow-hidden rounded-md border bg-card">
        {[6, 7, 8, 9, 10, 11, 12].map((hour, i) => (
          <div
            key={hour}
            className="absolute right-0 left-0 border-t text-[10px] text-muted-foreground"
            style={{ top: `${(i / 7) * 100}%` }}
          >
            <span className="ml-1">{hour.toString().padStart(2, '0')}:00</span>
          </div>
        ))}
        <div
          className={cn(
            'absolute right-2 left-12 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-600/20 dark:text-blue-300',
            (resizeTop.isResizing || resizeBottom.isResizing) && 'shadow-lg ring-2 ring-primary/60',
          )}
          style={{
            top: `${(minutesFromTop / 420) * 100}%`,
            height: `${(durationMinutes / 420) * 100}%`,
          }}
        >
          Resize me from top or bottom
          <div
            {...resizeTop.handlers}
            className="absolute top-0 right-0 left-0 h-2 cursor-ns-resize touch-none"
          />
          <div
            {...resizeBottom.handlers}
            className="absolute right-0 bottom-0 left-0 h-2 cursor-ns-resize touch-none"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        {renderedStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        {' – '}
        {renderedEnd.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </p>
    </div>
  )
}
