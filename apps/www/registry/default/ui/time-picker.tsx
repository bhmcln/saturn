'use client'

import { Clock } from 'lucide-react'
import type * as React from 'react'

import { useControllableState } from '@/registry/default/hooks/use-controllable'
import { cn } from '@/registry/default/lib/utils'

export interface TimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** "HH:MM" (24-hour). */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Minute increment. */
  step?: number
  /** Render with a leading clock icon. */
  withIcon?: boolean
}

export function TimePicker({
  value,
  defaultValue,
  onValueChange,
  step = 5,
  withIcon = true,
  disabled,
  className,
  ...props
}: TimePickerProps) {
  const [current, setCurrent] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  return (
    <label
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm shadow-xs transition-colors',
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {withIcon && <Clock className="size-4 text-muted-foreground" aria-hidden />}
      <input
        {...props}
        type="time"
        step={step * 60}
        disabled={disabled}
        value={current ?? ''}
        onChange={(e) => setCurrent(e.target.value)}
        className="bg-transparent text-foreground outline-none [&::-webkit-calendar-picker-indicator]:opacity-0"
      />
    </label>
  )
}
