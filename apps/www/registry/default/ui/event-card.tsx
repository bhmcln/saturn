import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/registry/default/lib/utils'

export const EVENT_COLORS = ['gray', 'blue', 'pink', 'green', 'purple', 'amber'] as const
export type EventColor = (typeof EVENT_COLORS)[number]

const containerVariants = cva(
  'group flex flex-col overflow-y-auto rounded-lg p-2 text-xs/5 transition-colors',
  {
    variants: {
      color: {
        gray: 'bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15',
        blue: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/15 dark:hover:bg-blue-600/20',
        pink: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-600/15 dark:hover:bg-pink-600/20',
        green: 'bg-green-50 hover:bg-green-100 dark:bg-green-600/15 dark:hover:bg-green-600/20',
        purple: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-600/15 dark:hover:bg-purple-600/20',
        amber: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-600/15 dark:hover:bg-amber-600/20',
      },
    },
    defaultVariants: { color: 'gray' },
  },
)

const titleColorClasses: Record<EventColor, string> = {
  gray: 'text-gray-700 dark:text-gray-300',
  blue: 'text-blue-700 dark:text-blue-300',
  pink: 'text-pink-700 dark:text-pink-300',
  green: 'text-green-700 dark:text-green-300',
  purple: 'text-purple-700 dark:text-purple-300',
  amber: 'text-amber-700 dark:text-amber-300',
}

const timeColorClasses: Record<EventColor, string> = {
  gray: 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300',
  blue: 'text-blue-500 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300',
  pink: 'text-pink-500 group-hover:text-pink-700 dark:text-pink-400 dark:group-hover:text-pink-300',
  green:
    'text-green-500 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300',
  purple:
    'text-purple-500 group-hover:text-purple-700 dark:text-purple-400 dark:group-hover:text-purple-300',
  amber:
    'text-amber-500 group-hover:text-amber-700 dark:text-amber-400 dark:group-hover:text-amber-300',
}

const ColorContext = React.createContext<EventColor>('gray')

interface EventCardRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof containerVariants> {}

function EventCardRoot({
  className,
  color = 'gray',
  children,
  ...props
}: EventCardRootProps) {
  return (
    <ColorContext.Provider value={color ?? 'gray'}>
      <div className={cn(containerVariants({ color }), className)} {...props}>
        {children}
      </div>
    </ColorContext.Provider>
  )
}

function EventCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const color = React.useContext(ColorContext)
  return (
    <p
      className={cn('order-1 font-semibold', titleColorClasses[color], className)}
      {...props}
    />
  )
}

function EventCardTime({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const color = React.useContext(ColorContext)
  return <p className={cn(timeColorClasses[color], className)} {...props} />
}

export const EventCard = Object.assign(EventCardRoot, {
  Title: EventCardTitle,
  Time: EventCardTime,
})
