'use client'

import { useEventDrag } from '@/registry/default/hooks/use-event-drag'
import { cn } from '@/registry/default/lib/utils'
import { useRef, useState } from 'react'

const MS_PER_PX = (60 * 1000) / 2 // 1px vertical = 30s; 2px = 1min

export function UseEventDragDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [start, setStart] = useState(() => {
    const d = new Date()
    d.setHours(10, 0, 0, 0)
    return d
  })
  const [dragMs, setDragMs] = useState(0)

  const { isDragging, handlers } = useEventDrag({
    snapMinutes: 15,
    getDelta: (_dx, dy) => dy * MS_PER_PX,
    onDrag: setDragMs,
    onMove: (delta) => {
      setDragMs(0)
      setStart(new Date(start.getTime() + delta))
    },
  })

  const renderedStart = new Date(start.getTime() + dragMs)
  const minutesFromTop = renderedStart.getHours() * 60 + renderedStart.getMinutes() - 6 * 60

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        className="relative h-72 w-64 overflow-hidden rounded-md border bg-card"
      >
        {/* Hour markers */}
        {[6, 7, 8, 9, 10, 11].map((hour, i) => (
          <div
            key={hour}
            className="absolute right-0 left-0 border-t text-[10px] text-muted-foreground"
            style={{ top: `${(i / 6) * 100}%` }}
          >
            <span className="ml-1">{hour.toString().padStart(2, '0')}:00</span>
          </div>
        ))}

        {/* Draggable block */}
        <div
          {...handlers}
          className={cn(
            'absolute right-2 left-12 cursor-grab touch-none select-none rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-600/20 dark:text-blue-300',
            isDragging && 'cursor-grabbing shadow-lg ring-2 ring-primary/60',
          )}
          style={{ top: `${(minutesFromTop / 360) * 100}%`, height: '14%' }}
        >
          Drag me — snaps to 15 min
        </div>
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        start: {renderedStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </p>
    </div>
  )
}
