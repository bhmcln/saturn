'use client'

import { cn } from '@/registry/default/lib/utils'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Check, ChevronDown } from 'lucide-react'
import * as React from 'react'

export type ViewMode = 'day' | 'week' | 'month' | 'agenda' | 'timeline' | (string & {})

const DEFAULT_LABELS: Record<string, string> = {
  day: 'Day view',
  week: 'Week view',
  month: 'Month view',
  agenda: 'Agenda',
  timeline: 'Timeline',
}

export interface ViewModeSwitcherProps {
  value: ViewMode
  onValueChange: (mode: ViewMode) => void
  views: ViewMode[]
  labels?: Partial<Record<ViewMode, string>>
  className?: string
}

export function ViewModeSwitcher({
  value,
  onValueChange,
  views,
  labels,
  className,
}: ViewModeSwitcherProps) {
  const labelOf = (m: ViewMode) => labels?.[m] ?? DEFAULT_LABELS[m] ?? m

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          className,
        )}
      >
        {labelOf(value)}
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {views.map((mode) => (
            <DropdownMenu.Item
              key={mode}
              onSelect={() => onValueChange(mode)}
              className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
            >
              <span className="flex size-4 items-center justify-center">
                {value === mode ? <Check className="size-4" aria-hidden /> : null}
              </span>
              {labelOf(mode)}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
