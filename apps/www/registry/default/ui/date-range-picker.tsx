'use client'

import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { useControllableState } from '@/registry/default/hooks/use-controllable'
import { cn } from '@/registry/default/lib/utils'
import { Button } from '@/registry/default/ui/button'
import { MiniCalendar } from '@/registry/default/ui/mini-calendar'

export type { DateRange }

export interface DateRangePickerProps {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  placeholder?: string
  /** How many month panels to render side-by-side. Default 2 (≥md) / 1 (<md). */
  numberOfMonths?: number
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Pick a date range',
  numberOfMonths = 2,
  disabled,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [range, setRange] = useControllableState<DateRange | undefined>({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  const label = (() => {
    if (!range?.from) return placeholder
    if (range.to) return `${format(range.from, 'LLL d, y')} – ${format(range.to, 'LLL d, y')}`
    return format(range.from, 'LLL d, y')
  })()

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[300px] justify-start text-left font-normal',
            !range?.from && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4" />
          {label}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 rounded-md border bg-popover p-0 text-popover-foreground shadow-lg outline-none"
        >
          <MiniCalendar
            mode="range"
            selected={range}
            defaultMonth={range?.from}
            numberOfMonths={numberOfMonths}
            onSelect={(r) => setRange(r as DateRange | undefined)}
            autoFocus
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
