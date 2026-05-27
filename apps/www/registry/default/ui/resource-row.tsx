'use client'

import { cn } from '@/registry/default/lib/utils'
import { useTimeline } from '@/registry/default/ui/timeline-view'
import type * as React from 'react'

export interface ResourceRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sticky-left content (avatar + name + stats, typically). */
  label?: React.ReactNode
  /** Row height. Defaults to "5rem". */
  height?: string
}

function ResourceRowRoot({
  label,
  height = '5rem',
  className,
  children,
  ...props
}: ResourceRowProps) {
  const { labelWidth } = useTimeline()
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
      <div className="relative flex-auto">{children}</div>
    </div>
  )
}

export interface ResourceRowBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  start: Date
  end: Date
}

/**
 * Position a block on the row's horizontal track using the parent
 * TimelineView's viewport. Hidden automatically when the range lies fully
 * outside the viewport.
 */
function Block({ start, end, className, style, children, ...props }: ResourceRowBlockProps) {
  const { position } = useTimeline()
  const { offsetPct, lengthPct } = position(start, end)
  if (lengthPct <= 0) return null
  return (
    <div
      className={cn('absolute top-1 bottom-1', className)}
      style={{ left: `${offsetPct}%`, width: `${lengthPct}%`, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export const ResourceRow = Object.assign(ResourceRowRoot, { Block })
