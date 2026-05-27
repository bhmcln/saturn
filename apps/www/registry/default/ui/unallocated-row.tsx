import { cn } from '@/registry/default/lib/utils'
import type * as React from 'react'

export interface UnallocatedRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the sticky-left label column. Defaults to "12rem". */
  labelWidth?: string
  /** Number of day cells. Defaults to 7. */
  dayCount?: number
}

function UnallocatedRowRoot({
  labelWidth = '12rem',
  dayCount = 7,
  className,
  children,
  ...props
}: UnallocatedRowProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-20 flex min-h-14 flex-none border-t bg-muted/30 backdrop-blur supports-[backdrop-filter]:bg-muted/60',
        className,
      )}
      style={{
        gridTemplateColumns: `${labelWidth} repeat(${dayCount}, minmax(0, 1fr))`,
        display: 'grid',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function Label({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'sticky left-0 z-10 flex items-center gap-2 border-r bg-muted/60 px-3 text-xs font-semibold text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function Cell({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start gap-1 border-l p-1.5 first-of-type:border-l-0',
        className,
      )}
      {...props}
    />
  )
}

export interface UnallocatedChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function Chip({ className, children, ...props }: UnallocatedChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-dashed border-border bg-background px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export const UnallocatedRow = Object.assign(UnallocatedRowRoot, { Label, Cell, Chip })
