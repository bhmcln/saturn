'use client'

import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { type WeekStartsOn, addDays } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'

export interface CalendarEvent {
  id: string
  start: Date
  end: Date
}

interface YearViewContextValue {
  year: number
  weekStartsOn: WeekStartsOn
  events: CalendarEvent[]
  onYearChange?: (year: number) => void
  onDateSelect?: (date: Date) => void
}

const YearViewContext = React.createContext<YearViewContextValue | null>(null)

function useYearView() {
  const ctx = React.useContext(YearViewContext)
  if (!ctx) {
    throw new Error('YearView.* subcomponents must be rendered inside <YearView>')
  }
  return ctx
}

export interface YearViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  year: number
  events?: CalendarEvent[]
  weekStartsOn?: WeekStartsOn
  onYearChange?: (year: number) => void
  /** Fires when the user clicks a day cell. */
  onDateSelect?: (date: Date) => void
}

function YearViewRoot({
  year,
  events = [],
  weekStartsOn = 0,
  onYearChange,
  onDateSelect,
  className,
  children,
  ...props
}: YearViewProps) {
  const value = React.useMemo<YearViewContextValue>(
    () => ({ year, weekStartsOn, events, onYearChange, onDateSelect }),
    [year, weekStartsOn, events, onYearChange, onDateSelect],
  )
  return (
    <YearViewContext.Provider value={value}>
      <div className={cn('flex h-full flex-col', className)} {...props}>
        {children}
      </div>
    </YearViewContext.Provider>
  )
}

function Header({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn('flex flex-none items-center justify-between border-b px-6 py-4', className)}
      {...props}
    />
  )
}

function Title({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { year } = useYearView()
  return (
    <h1 className={cn('text-base font-semibold text-foreground', className)} {...props}>
      <time dateTime={String(year)}>{year}</time>
    </h1>
  )
}

function Navigation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { year, onYearChange } = useYearView()
  return (
    <div
      className={cn(
        'relative flex items-center rounded-md border bg-background shadow-xs md:items-stretch',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={() => onYearChange?.(year - 1)}
        className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-muted-foreground hover:text-foreground md:w-9 md:pr-0 md:hover:bg-accent"
      >
        <span className="sr-only">Previous year</span>
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => onYearChange?.(new Date().getFullYear())}
        className="hidden border-x px-3.5 text-sm font-semibold text-foreground hover:bg-accent md:block"
      >
        This year
      </button>
      <span className="relative -mx-px h-5 w-px bg-border md:hidden" />
      <button
        type="button"
        onClick={() => onYearChange?.(year + 1)}
        className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-muted-foreground hover:text-foreground md:w-9 md:pl-0 md:hover:bg-accent"
      >
        <span className="sr-only">Next year</span>
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </div>
  )
}

/** Map an event count to a heatmap-style bg class. */
function densityClass(count: number): string {
  if (count === 0) return ''
  if (count === 1) return 'bg-primary/15'
  if (count === 2) return 'bg-primary/30'
  if (count <= 4) return 'bg-primary/50 text-primary-foreground'
  return 'bg-primary/75 text-primary-foreground'
}

function MonthPanel({ month }: { month: Date }) {
  const { weekStartsOn, events, onDateSelect } = useYearView()

  const cells = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn })
    const end = endOfMonth(month)
    const dates: Date[] = []
    let cursor = start
    while (cursor <= end || dates.length % 7 !== 0) {
      dates.push(cursor)
      cursor = addDays(cursor, 1)
      if (dates.length >= 42) break
    }
    return dates
  }, [month, weekStartsOn])

  const weekdays = cells.slice(0, 7)

  return (
    <div className="rounded-lg border bg-card p-3">
      <h3 className="mb-2 text-sm font-semibold tracking-tight text-foreground">
        {format(month, 'MMMM')}
      </h3>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-muted-foreground">
        {weekdays.map((d) => (
          <div key={d.toISOString()} className="font-medium">
            {format(d, 'EEEEE')}
          </div>
        ))}
        {cells.map((day) => {
          const inMonth = isSameMonth(day, month)
          const count = events.filter((e) => isSameDay(e.start, day)).length
          const density = inMonth ? densityClass(count) : ''
          const today = isToday(day)
          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => onDateSelect?.(day)}
              disabled={!inMonth}
              title={inMonth ? `${count} event${count === 1 ? '' : 's'}` : undefined}
              className={cn(
                'flex aspect-square items-center justify-center rounded text-[11px] tabular-nums transition-colors',
                inMonth ? density || 'text-foreground hover:bg-muted' : 'text-muted-foreground/40',
                today && 'ring-1 ring-primary',
                inMonth && 'cursor-pointer',
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Grid({ className }: { className?: string }) {
  const { year } = useYearView()
  const months = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => addMonths(new Date(year, 0, 1), i)),
    [year],
  )
  return (
    <div
      className={cn(
        'grid flex-auto gap-4 overflow-auto p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {months.map((m) => (
        <MonthPanel key={m.toISOString()} month={m} />
      ))}
    </div>
  )
}

export const YearView = Object.assign(YearViewRoot, {
  Header,
  Title,
  Navigation,
  Grid,
})
