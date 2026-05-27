'use client'

import * as Popover from '@radix-ui/react-popover'
import { addDays, differenceInCalendarDays, format, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/registry/default/lib/utils'
import { Button } from '@/registry/default/ui/button'
import { MiniCalendar } from '@/registry/default/ui/mini-calendar'

export interface PeriodNavigatorProps {
  /** Start of the current period (treated as local midnight). */
  periodStart: Date
  /** Length of one period in days (e.g. 7 for week, 14 for fortnight). */
  periodLengthDays: number
  /** Fires when the user jumps to a new period start. */
  onPeriodChange: (date: Date) => void
  className?: string
}

/**
 * Prev / current-period-popover / next navigation with a calendar popover
 * that tints the current period and accents every period boundary so the
 * cadence is visible without paging. Ported from the IHC roster's
 * PeriodNavigator.
 */
export function PeriodNavigator({
  periodStart,
  periodLengthDays,
  onPeriodChange,
  className,
}: PeriodNavigatorProps) {
  const [pickerOpen, setPickerOpen] = React.useState(false)

  const periodEndInclusive = addDays(periodStart, periodLengthDays - 1)
  const previousStart = addDays(periodStart, -periodLengthDays)
  const nextStart = addDays(periodStart, periodLengthDays)
  const today = startOfDay(new Date())

  const currentLabel = formatPeriodLabel(periodStart, periodEndInclusive)
  const prevLabel = formatPeriodLabel(previousStart, addDays(previousStart, periodLengthDays - 1))
  const nextLabel = formatPeriodLabel(nextStart, addDays(nextStart, periodLengthDays - 1))

  const isViewingPast = periodEndInclusive < today
  const isViewingFuture = periodStart > today

  // Period boundaries are deterministic: every `periodLengthDays` from the
  // current period's start. Visible across the calendar so the cadence is
  // obvious rather than something the user has to derive.
  const isPeriodBoundary = (date: Date) => {
    const diff = differenceInCalendarDays(date, periodStart)
    return ((diff % periodLengthDays) + periodLengthDays) % periodLengthDays === 0
  }
  const isInCurrentPeriod = (date: Date) => {
    const diff = differenceInCalendarDays(date, periodStart)
    return diff >= 0 && diff < periodLengthDays
  }

  const todayButton = (
    <Button variant="outline" size="sm" onClick={() => onPeriodChange(today)}>
      Today
    </Button>
  )

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPeriodChange(previousStart)}
        title={prevLabel}
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">{prevLabel}</span>
      </Button>

      {isViewingPast && todayButton}

      <div className="flex flex-1 justify-center">
        <Popover.Root open={pickerOpen} onOpenChange={setPickerOpen}>
          <Popover.Trigger asChild>
            <Button variant="outline" size="sm" className="font-semibold">
              <CalendarIcon className="size-4" />
              {currentLabel}
            </Button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="center"
              sideOffset={8}
              className="z-50 rounded-md border bg-popover p-0 text-popover-foreground shadow-lg outline-none"
            >
              <MiniCalendar
                mode="single"
                selected={periodStart}
                defaultMonth={periodStart}
                onSelect={(d) => {
                  if (!d) return
                  setPickerOpen(false)
                  onPeriodChange(d)
                }}
                captionLayout="dropdown"
                autoFocus
                modifiers={{
                  periodBoundary: isPeriodBoundary,
                  inCurrentPeriod: isInCurrentPeriod,
                }}
                modifiersClassNames={{
                  periodBoundary:
                    "before:absolute before:top-0 before:right-1 before:left-1 before:h-0.5 before:rounded-full before:bg-primary before:content-['']",
                  inCurrentPeriod: 'bg-primary/10',
                }}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {isViewingFuture && todayButton}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPeriodChange(nextStart)}
        title={nextLabel}
      >
        <span className="hidden sm:inline">{nextLabel}</span>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

/** "3 Mar – 16 Mar 2026" (omits year on the start when both fall in the same year). */
function formatPeriodLabel(start: Date, end: Date): string {
  if (start.getFullYear() !== end.getFullYear()) {
    return `${format(start, 'd MMM yyyy')} – ${format(end, 'd MMM yyyy')}`
  }
  return `${format(start, 'd MMM')} – ${format(end, 'd MMM yyyy')}`
}
