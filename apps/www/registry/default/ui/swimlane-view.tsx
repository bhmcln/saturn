'use client'

import { cn } from '@/registry/default/lib/utils'
import { ChevronRight } from 'lucide-react'
import * as React from 'react'

export interface SwimlaneGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  /** Optional supporting label rendered on the right of the header. */
  meta?: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}

/**
 * Sectioning primitive used inside a TimelineView.Body to group
 * resource-rows under a shared header (e.g. by team, branch, qualification).
 * Collapsible behaviour is opt-in.
 */
export function SwimlaneGroup({
  title,
  meta,
  collapsible = false,
  defaultOpen = true,
  className,
  children,
  ...props
}: SwimlaneGroupProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const isOpen = !collapsible || open

  const headerInner = (
    <>
      {collapsible && (
        <ChevronRight
          className={cn('size-3 transition-transform', isOpen && 'rotate-90')}
          aria-hidden
        />
      )}
      <span className="font-semibold tracking-tight">{title}</span>
      {meta && <span className="ml-auto font-normal text-muted-foreground">{meta}</span>}
    </>
  )

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="sticky left-0 z-[5] flex w-full items-center gap-2 border-b bg-muted/40 px-3 py-1.5 text-left text-xs text-foreground hover:bg-muted/60"
          aria-expanded={isOpen}
        >
          {headerInner}
        </button>
      ) : (
        <div className="sticky left-0 z-[5] flex items-center gap-2 border-b bg-muted/40 px-3 py-1.5 text-xs text-foreground">
          {headerInner}
        </div>
      )}
      {isOpen && <div className="flex flex-col">{children}</div>}
    </div>
  )
}
