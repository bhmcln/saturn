import { cn } from '@/registry/default/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

const overlayVariants = cva('pointer-events-none absolute top-0 bottom-0', {
  variants: {
    kind: {
      available: 'bg-green-100/40 dark:bg-green-900/15',
      unavailable: 'bg-muted/60',
      offShift: 'bg-muted/30',
    },
  },
  defaultVariants: { kind: 'available' },
})

export interface AvailabilityOverlayProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof overlayVariants> {
  /** Left offset as a percentage of the parent track. */
  offsetPct: number
  /** Width as a percentage of the parent track. */
  widthPct: number
}

/**
 * Translucent band positioned along a horizontal track, indicating
 * available / unavailable / off-shift windows. Pairs with timeline-view
 * and resource-row. `pointer-events-none` so it never blocks clicks on
 * activity blocks layered above.
 */
export function AvailabilityOverlay({
  offsetPct,
  widthPct,
  kind = 'available',
  className,
  style,
  ...props
}: AvailabilityOverlayProps) {
  return (
    <div
      role="presentation"
      className={cn(overlayVariants({ kind }), className)}
      style={{ left: `${offsetPct}%`, width: `${widthPct}%`, ...style }}
      {...props}
    />
  )
}
