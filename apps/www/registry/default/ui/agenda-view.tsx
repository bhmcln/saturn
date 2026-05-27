'use client'

import { addDays, format, isSameDay, isToday, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

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

interface AgendaViewContextValue {
  date: Date
  days: number
  events: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

const AgendaViewContext = React.createContext<AgendaViewContextValue | null>(null)

function useAgendaView() {
  const ctx = React.useContext(AgendaViewContext)
  if (!ctx) {
    throw new Error('AgendaView.* subcomponents must be rendered inside <AgendaView>')
  }
  return ctx
}

export interface AgendaViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  date: Date
  /** Number of days to display starting at `date`. Defaults to 7. */
  days?: number
  events?: CalendarEvent[]
  onDateChange?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

function AgendaViewRoot({
  date,
  days = 7,
  events = [],
  onDateChange,
  onEventClick,
  className,
  children,
  ...props
}: AgendaViewProps) {
  const value = React.useMemo<AgendaViewContextValue>(
    () => ({ date, days, events, onDateChange, onEventClick }),
    [date, days, events, onDateChange, onEventClick],
  )
  return (
    <AgendaViewContext.Provider value={value}>
      <div className={cn('flex h-full flex-col', className)} {...props}>
        {children}
      </div>
    </AgendaViewContext.Provider>
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
  const { date, days } = useAgendaView()
  const end = addDays(date, days - 1)
  return (
    <h1 className={cn('text-base font-semibold text-foreground', className)} {...props}>
      <time dateTime={format(date, 'yyyy-MM-dd')}>{format(date, 'MMM d')}</time>
      <span className="mx-1.5 text-muted-foreground">–</span>
      <time dateTime={format(end, 'yyyy-MM-dd')}>{format(end, 'MMM d, yyyy')}</time>
    </h1>
  )
}

function Navigation({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { date, days, onDateChange } = useAgendaView()
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
        onClick={() => onDateChange?.(addDays(date, -days))}
        className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-muted-foreground hover:text-foreground md:w-9 md:pr-0 md:hover:bg-accent"
      >
        <span className="sr-only">Previous range</span>
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => onDateChange?.(startOfDay(new Date()))}
        className="hidden border-x px-3.5 text-sm font-semibold text-foreground hover:bg-accent md:block"
      >
        Today
      </button>
      <span className="relative -mx-px h-5 w-px bg-border md:hidden" />
      <button
        type="button"
        onClick={() => onDateChange?.(addDays(date, days))}
        className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-muted-foreground hover:text-foreground md:w-9 md:pl-0 md:hover:bg-accent"
      >
        <span className="sr-only">Next range</span>
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </div>
  )
}

const EVENT_COLOR_BAR: Record<EventColor, string> = {
  gray: 'bg-gray-500',
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
}

function List({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  const { date, days, events, onEventClick } = useAgendaView()

  const groups = React.useMemo(() => {
    const start = startOfDay(date)
    return Array.from({ length: days }, (_, i) => {
      const d = addDays(start, i)
      const dayEvents = events
        .filter((e) => isSameDay(e.start, d))
        .sort((a, b) => a.start.getTime() - b.start.getTime())
      return { day: d, events: dayEvents }
    })
  }, [date, days, events])

  const isAllEmpty = groups.every((g) => g.events.length === 0)

  if (isAllEmpty) {
    return (
      <div className="flex flex-auto items-center justify-center py-16 text-sm text-muted-foreground">
        No events in this range.
      </div>
    )
  }

  return (
    <ol className={cn('flex-auto divide-y overflow-auto', className)} {...props}>
      {groups.map(({ day, events: dayEvents }) => {
        if (dayEvents.length === 0) return null
        return (
          <li key={day.toISOString()} className="px-6 py-4">
            <div className="mb-3 flex items-baseline gap-2">
              <span
                className={cn(
                  'text-sm font-semibold',
                  isToday(day) ? 'text-primary' : 'text-foreground',
                )}
              >
                {isToday(day) ? 'Today' : format(day, 'EEEE')}
              </span>
              <span className="text-xs text-muted-foreground">{format(day, 'MMM d')}</span>
            </div>
            <ol className="space-y-1.5">
              {dayEvents.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => onEventClick?.(event)}
                    className="group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <span
                      className={cn(
                        'h-8 w-1 shrink-0 rounded-full',
                        EVENT_COLOR_BAR[event.color ?? 'gray'],
                      )}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">
                      <span className="block font-medium text-foreground group-hover:underline">
                        {event.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        <time dateTime={event.start.toISOString()}>
                          {format(event.start, 'h:mm a')}
                        </time>
                        <span className="mx-1">–</span>
                        <time dateTime={event.end.toISOString()}>
                          {format(event.end, 'h:mm a')}
                        </time>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </li>
        )
      })}
    </ol>
  )
}

export const AgendaView = Object.assign(AgendaViewRoot, {
  Header,
  Title,
  Navigation,
  List,
})
