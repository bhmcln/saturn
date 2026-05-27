'use client'

import { cn } from '@/registry/default/lib/utils'
import { Button } from '@/registry/default/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip'
import { Maximize2, Minus, Plus } from 'lucide-react'

export interface ZoomControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  /** Optional handler for the fit-to-viewport button. Omit to hide. */
  onFit?: () => void
  /** Optional reset handler (click on the % label). */
  onReset?: () => void
  className?: string
}

/**
 * Three-button zoom toolbar (out / current% / in) with an optional fit
 * button. Pair with `useZoom` from the hooks foundation.
 */
export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFit,
  onReset,
  className,
}: ZoomControlsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-stretch rounded-md border bg-background shadow-xs',
        className,
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onZoomOut}
            className="rounded-r-none border-r"
            aria-label="Zoom out"
          >
            <Minus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom out</TooltipContent>
      </Tooltip>
      <button
        type="button"
        onClick={onReset}
        disabled={!onReset}
        className="px-2.5 text-xs font-medium text-muted-foreground tabular-nums hover:bg-accent hover:text-foreground disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        aria-label={onReset ? 'Reset zoom' : 'Current zoom'}
      >
        {Math.round(zoom * 100)}%
      </button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onZoomIn}
            className={cn('rounded-l-none border-l', onFit && 'rounded-r-none border-r')}
            aria-label="Zoom in"
          >
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom in</TooltipContent>
      </Tooltip>
      {onFit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onFit}
              className="rounded-l-none"
              aria-label="Fit to viewport"
            >
              <Maximize2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fit to viewport</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
