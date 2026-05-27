'use client'

import * as React from 'react'
import { useNow } from '@/registry/default/hooks/use-now'
import { dayFraction } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'

export interface NowIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the current time. Useful for tests or static showcase. */
  date?: Date
  /**
   * If true, the indicator is positioned within the parent (assumed to span
   * a 24-hour vertical range). Set false to render the visual without
   * absolute positioning so the parent can place it itself.
   */
  positioned?: boolean
}

/**
 * Horizontal "current time" line + dot. By default positions itself
 * absolutely at `dayFraction(now) * 100%` from the top of its containing
 * block — drop it inside any parent that represents a 24h vertical axis.
 */
export function NowIndicator({
  date,
  positioned = true,
  className,
  style,
  ...props
}: NowIndicatorProps) {
  const now = useNow()
  const actual = date ?? now
  const top = dayFraction(actual) * 100
  return (
    <div
      role="presentation"
      style={positioned ? { top: `${top}%`, ...style } : style}
      className={cn(
        'pointer-events-none z-20 flex items-center',
        positioned && 'absolute right-0 left-0',
        className,
      )}
      {...props}
    >
      <div className="size-2 -translate-x-1/2 rounded-full bg-red-500" />
      <div className="h-px flex-auto bg-red-500" />
    </div>
  )
}
