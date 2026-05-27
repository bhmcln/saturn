'use client'

import { useDragToCreate } from '@/registry/default/hooks/use-drag-to-create'
import { useEventDrag } from '@/registry/default/hooks/use-event-drag'
import { useEventResize } from '@/registry/default/hooks/use-event-resize'
import { cn } from '@/registry/default/lib/utils'
import { useTimeline } from '@/registry/default/ui/timeline-view'
import * as React from 'react'

export interface ResourceRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sticky-left content (avatar + name + stats, typically). */
  label?: React.ReactNode
  /** Row height. Defaults to "5rem". */
  height?: string
  /**
   * Drag on the row's empty track to create a new block. Receives start +
   * end snapped to the parent's drag-to-create snap. Set to enable.
   */
  onCreateBlock?: (start: Date, end: Date) => void
}

function ResourceRowRoot({
  label,
  height = '5rem',
  className,
  children,
  onCreateBlock,
  ...props
}: ResourceRowProps) {
  const { labelWidth, viewportStart, viewportEnd, viewportMs } = useTimeline()
  const trackRef = React.useRef<HTMLDivElement>(null)

  const pointToDate = (point: { x: number; y: number }): Date => {
    const track = trackRef.current
    if (!track) return viewportStart
    const rect = track.getBoundingClientRect()
    if (rect.width <= 0) return viewportStart
    const ratio = Math.max(0, Math.min(1, point.x / rect.width))
    return new Date(viewportStart.getTime() + ratio * viewportMs)
  }
  void viewportEnd // referenced via viewportMs

  const { preview, handlers } = useDragToCreate({
    disabled: !onCreateBlock,
    snapMinutes: 15,
    pointToDate,
    onCreate: (start, end) => onCreateBlock?.(start, end),
  })

  return (
    <div
      className={cn('flex flex-none border-b last:border-b-0', className)}
      style={{ height }}
      {...props}
    >
      <div
        className="sticky left-0 z-10 flex flex-none items-center gap-2 border-r bg-background px-3 text-sm"
        style={{ width: labelWidth }}
      >
        {label}
      </div>
      <div
        ref={trackRef}
        className={cn('relative flex-auto', onCreateBlock && 'cursor-crosshair')}
        {...handlers}
      >
        {children}
        {preview && <CreatePreview start={preview.start} end={preview.end} />}
      </div>
    </div>
  )
}

function CreatePreview({ start, end }: { start: Date; end: Date }) {
  const { position } = useTimeline()
  const { offsetPct, lengthPct } = position(start, end)
  if (lengthPct <= 0) return null
  return (
    <div
      style={{ left: `${offsetPct}%`, width: `${lengthPct}%` }}
      className="pointer-events-none absolute top-1 bottom-1 flex items-center rounded-md border-2 border-primary bg-primary/15 px-2 text-xs font-semibold text-primary"
    >
      {formatTime(start)} – {formatTime(end)}
    </div>
  )
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export interface ResourceRowBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  start: Date
  end: Date
  /** Enable horizontal drag-to-reschedule. */
  onMove?: (newStart: Date, newEnd: Date) => void
  /** Enable left/right edge resize. */
  onResize?: (newStart: Date, newEnd: Date) => void
}

/**
 * Position a block on the row's horizontal track using the parent
 * TimelineView's viewport. Hidden automatically when the range lies fully
 * outside the viewport. Wire `onMove` and `onResize` to enable drag-to-
 * reschedule and edge resize.
 */
function Block({
  start,
  end,
  className,
  style,
  children,
  onMove,
  onResize,
  ...props
}: ResourceRowBlockProps) {
  const { position, viewportMs } = useTimeline()
  const [dragMs, setDragMs] = React.useState(0)
  const [resizeLeftMs, setResizeLeftMs] = React.useState(0)
  const [resizeRightMs, setResizeRightMs] = React.useState(0)
  const blockRef = React.useRef<HTMLDivElement>(null)

  const horizontalMsPerPx = (): number => {
    const el = blockRef.current?.parentElement
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return 0
    return viewportMs / rect.width
  }

  const moveDrag = useEventDrag({
    disabled: !onMove,
    snapMinutes: 15,
    getDelta: (dx) => dx * horizontalMsPerPx(),
    onDrag: setDragMs,
    onMove(delta) {
      setDragMs(0)
      if (!onMove) return
      onMove(new Date(start.getTime() + delta), new Date(end.getTime() + delta))
    },
  })

  const resizeLeft = useEventResize({
    edge: 'top',
    disabled: !onResize,
    snapMinutes: 15,
    getDelta: (dx) => dx * horizontalMsPerPx(),
    onDragging: setResizeLeftMs,
    onResize(delta) {
      setResizeLeftMs(0)
      if (!onResize) return
      const newStart = new Date(start.getTime() + delta)
      if (newStart >= end) return
      onResize(newStart, end)
    },
  })

  const resizeRight = useEventResize({
    edge: 'bottom',
    disabled: !onResize,
    snapMinutes: 15,
    getDelta: (dx) => dx * horizontalMsPerPx(),
    onDragging: setResizeRightMs,
    onResize(delta) {
      setResizeRightMs(0)
      if (!onResize) return
      const newEnd = new Date(end.getTime() + delta)
      if (newEnd <= start) return
      onResize(start, newEnd)
    },
  })

  const renderedStart = new Date(start.getTime() + dragMs + resizeLeftMs)
  const renderedEnd = new Date(end.getTime() + dragMs + resizeRightMs)
  const { offsetPct, lengthPct } = position(renderedStart, renderedEnd)
  if (lengthPct <= 0) return null

  const isInteracting = moveDrag.isDragging || resizeLeft.isResizing || resizeRight.isResizing

  const stopAndStart =
    (h: (event: React.PointerEvent<HTMLElement>) => void) =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation()
      h(event)
    }

  return (
    <div
      ref={blockRef}
      className={cn(
        'group/block absolute top-1 bottom-1 touch-none select-none',
        onMove && 'cursor-grab',
        isInteracting && 'z-30 cursor-grabbing',
        className,
      )}
      style={{ left: `${offsetPct}%`, width: `${lengthPct}%`, ...style }}
      {...(onMove ? moveDrag.handlers : {})}
      {...props}
    >
      {children}
      {onResize && (
        <>
          <div
            onPointerDown={stopAndStart(resizeLeft.handlers.onPointerDown)}
            className="absolute top-0 bottom-0 left-0 w-1.5 cursor-ew-resize touch-none opacity-0 transition-opacity group-hover/block:opacity-100"
            aria-label="Resize block start"
          />
          <div
            onPointerDown={stopAndStart(resizeRight.handlers.onPointerDown)}
            className="absolute top-0 right-0 bottom-0 w-1.5 cursor-ew-resize touch-none opacity-0 transition-opacity group-hover/block:opacity-100"
            aria-label="Resize block end"
          />
        </>
      )}
    </div>
  )
}

export const ResourceRow = Object.assign(ResourceRowRoot, { Block })
