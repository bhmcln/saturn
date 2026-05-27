'use client'

import * as Popover from '@radix-ui/react-popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { useControllableState } from '@/registry/default/hooks/use-controllable'
import { cn } from '@/registry/default/lib/utils'
import { Button } from '@/registry/default/ui/button'
import { MiniCalendar } from '@/registry/default/ui/mini-calendar'

export interface DatePickerProps {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  /** Format string passed to date-fns (default "PPP" → "January 22, 2026"). */
  formatString?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Pick a date',
  formatString = 'PPP',
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [current, setCurrent] = useControllableState<Date | undefined>({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !current && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4" />
          {current ? format(current, formatString) : placeholder}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 rounded-md border bg-popover p-0 text-popover-foreground shadow-lg outline-none"
        >
          <MiniCalendar
            mode="single"
            selected={current}
            defaultMonth={current}
            onSelect={(d) => {
              setCurrent(d as Date | undefined)
              if (d) setOpen(false)
            }}
            autoFocus
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
