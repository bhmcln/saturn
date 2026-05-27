'use client'

import { useDragToCreate } from '@/registry/default/hooks/use-drag-to-create'
import { cn } from '@/registry/default/lib/utils'
import { useRef, useState } from 'react'

interface DemoEvent {
  id: string
  start: Date
  end: Date
}

const HOURS = [7, 8, 9, 10, 11, 12, 13]

export function UseDragToCreateDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [events, setEvents] = useState<DemoEvent[]>([])

  const pointToDate = (point: { x: number; y: number }) => {
    const el = containerRef.current
    if (!el) return new Date()
    const rect = el.getBoundingClientRect()
    const minutes = (point.y / rect.height) * (HOURS.length - 1) * 60 + HOURS[0]! * 60
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setMinutes(minutes)
    return d
  }

  const { preview, handlers } = useDragToCreate({
    snapMinutes: 15,
    pointToDate,
    onCreate(start, end) {
      setEvents((current) => [...current, { id: `${Date.now()}`, start, end }])
    },
  })

  const blockPosition = (start: Date, end: Date) => {
    const baseMin = HOURS[0]! * 60
    const total = (HOURS.length - 1) * 60
    const startMin = start.getHours() * 60 + start.getMinutes() - baseMin
    const durationMin = (end.getTime() - start.getTime()) / 60000
    return {
      top: `${(startMin / total) * 100}%`,
      height: `${(durationMin / total) * 100}%`,
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        className="relative h-72 w-72 cursor-crosshair touch-none overflow-hidden rounded-md border bg-card"
        {...handlers}
      >
        {HOURS.map((h, i) => (
          <div
            key={h}
            className="absolute right-0 left-0 border-t text-[10px] text-muted-foreground"
            style={{ top: `${(i / (HOURS.length - 1)) * 100}%` }}
          >
            <span className="ml-1">{h.toString().padStart(2, '0')}:00</span>
          </div>
        ))}
        {events.map((e) => (
          <div
            key={e.id}
            className="pointer-events-none absolute right-2 left-12 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-600/20 dark:text-blue-300"
            style={blockPosition(e.start, e.end)}
          >
            New event
          </div>
        ))}
        {preview && (
          <div
            className={cn(
              'pointer-events-none absolute right-2 left-12 rounded-md border-2 border-primary bg-primary/15 px-2 py-1 text-xs font-semibold text-primary',
            )}
            style={blockPosition(preview.start, preview.end)}
          >
            {formatTime(preview.start)} – {formatTime(preview.end)}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Drag on empty space — releases create an event. {events.length} created so far.
      </p>
    </div>
  )
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
