'use client'

import { addMonths, format, isSameDay, isSameMonth, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { getMonthGrid, type WeekStartsOn } from '@/registry/default/lib/time'
import { cn } from '@/registry/default/lib/utils'
import type { EventColor } from '@/registry/default/ui/event-card'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color?: EventColor
  meta?: Record<string, unknown>
}

interface MonthViewContextValue {
  date: Date
  monthDays: Date[]
  weekStartsOn: WeekStartsOn
  events: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

const MonthViewContext = React.createContext<MonthViewContextValue | null>(null)

function useMonthView() {
  const ctx = React.useContext(MonthViewContext)
  if (!ctx) {
    throw new Error('MonthView.* subcomponents must be rendered inside <MonthView>')
  }
  return ctx
}

export interface MonthViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  date: Date
  events?: CalendarEvent[]
  weekStartsOn?: WeekStartsOn
  onDateChange?: (date: Date) => void
  /** Fires when a user clicks on a day cell. Useful for drill-down navigation. */
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

function MonthViewRoot({
  date,
  events = [],
  weekStartsOn = 0,
  onDateChange,
  onDateSelect,
  onEventClick,
  className,
  children,
  ...props
}: MonthViewProps) {
  const monthDays = React.useMemo(
    () => getMonthGrid(date, { weekStartsOn }),
    [date, weekStartsOn],
  )
  const value = React.useMemo<MonthViewContextValue>(
    () => ({
      date,
      monthDays,
      weekStartsOn,
      events,
      onDateChange,
      onDateSelect,
      onEventClick,
    }),
    [date, monthDays, weekStartsOn, events, onDateChange, onDateSelect, onEventClick],
  )
  return (
    <MonthViewContext.Provider value={value}>
      <div className={cn('flex h-full flex-col', className)} {...props}>
        {children}
      </div>
    </MonthViewContext.Provider>
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
  const { date } = useMonthView()
  return (
    <h1 className={cn('text-base font-semibold text-foreground', className)} {...props}>
      <time dateTime={format(date, 'yyyy-MM')}>{format(date, 'MMMM yyyy')}</time>
    </h1>
  )
}

function Navigation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { date, onDateChange } = useMonthView()
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
        onClick={() => onDateChange?.(addMonths(date, -1))}
        className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-muted-foreground hover:text-foreground md:w-9 md:pr-0 md:hover:bg-accent"
      >
        <span className="sr-only">Previous month</span>
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => onDateChange?.(new Date())}
        className="hidden border-x px-3.5 text-sm font-semibold text-foreground hover:bg-accent md:block"
      >
        Today
      </button>
      <span className="relative -mx-px h-5 w-px bg-border md:hidden" />
      <button
        type="button"
        onClick={() => onDateChange?.(addMonths(date, 1))}
        className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-muted-foreground hover:text-foreground md:w-9 md:pl-0 md:hover:bg-accent"
      >
        <span className="sr-only">Next month</span>
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </div>
  )
}

function Body({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'isolate flex flex-auto flex-col overflow-hidden bg-background ring-1 ring-border',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function WeekdayLabels() {
  const { monthDays } = useMonthView()
  const firstWeek = monthDays.slice(0, 7)
  return (
    <div className="grid grid-cols-7 gap-px border-b bg-border text-center text-xs/6 font-semibold text-muted-foreground">
      {firstWeek.map((day) => (
        <div
          key={day.toISOString()}
          className="flex justify-center bg-background py-2 text-foreground"
        >
          <span>{format(day, 'EEEEE')}</span>
          <span className="sr-only sm:not-sr-only sm:ml-0.5">{format(day, 'EEE').slice(1)}</span>
        </div>
      ))}
    </div>
  )
}

const EVENT_COLOR_DOT: Record<EventColor, string> = {
  gray: 'bg-gray-500',
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
}

interface GridProps {
  /** Max event chips shown per cell before "+N more". */
  maxEventsPerDay?: number
  className?: string
}

function Grid({ maxEventsPerDay = 3, className }: GridProps) {
  const { date, monthDays, events, onDateSelect, onEventClick } = useMonthView()

  return (
    <div
      className={cn(
        'grid flex-auto grid-cols-7 grid-rows-6 gap-px bg-border text-xs/6',
        className,
      )}
    >
      {monthDays.map((day) => {
        const dayEvents = events.filter((e) => isSameDay(e.start, day))
        const visible = dayEvents.slice(0, maxEventsPerDay)
        const overflow = Math.max(0, dayEvents.length - visible.length)
        const inMonth = isSameMonth(day, date)
        const today = isToday(day)

        return (
          <button
            type="button"
            key={day.toISOString()}
            onClick={() => onDateSelect?.(day)}
            className={cn(
              'group relative flex min-h-24 flex-col gap-1 bg-background px-2 py-1.5 text-left transition-colors hover:bg-accent',
              !inMonth && 'bg-muted/40 text-muted-foreground',
            )}
          >
            <time
              dateTime={format(day, 'yyyy-MM-dd')}
              className={cn(
                'flex size-6 items-center justify-center self-end rounded-full text-xs font-medium',
                today && 'bg-primary text-primary-foreground',
                !today && inMonth && 'text-foreground',
                !today && !inMonth && 'text-muted-foreground',
              )}
            >
              {format(day, 'd')}
            </time>
            <ol className="mt-auto flex flex-col gap-0.5">
              {visible.map((event) => (
                <li key={event.id}>
                  <span
                    role={onEventClick ? 'button' : undefined}
                    tabIndex={onEventClick ? 0 : undefined}
                    onClick={(e) => {
                      if (onEventClick) {
                        e.stopPropagation()
                        onEventClick(event)
                      }
                    }}
                    className="flex items-center gap-1.5 truncate text-foreground hover:underline"
                  >
                    <span
                      className={cn(
                        'size-1.5 shrink-0 rounded-full',
                        EVENT_COLOR_DOT[event.color ?? 'gray'],
                      )}
                    />
                    <span className="truncate">{event.title}</span>
                  </span>
                </li>
              ))}
              {overflow > 0 && (
                <li className="text-muted-foreground">+ {overflow} more</li>
              )}
            </ol>
          </button>
        )
      })}
    </div>
  )
}

export const MonthView = Object.assign(MonthViewRoot, {
  Header,
  Title,
  Navigation,
  Body,
  WeekdayLabels,
  Grid,
})
