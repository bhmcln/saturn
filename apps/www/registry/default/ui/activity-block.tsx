'use client'

import { type ActivityType, activityColors } from '@/registry/default/lib/activity-colors'
import { cn } from '@/registry/default/lib/utils'
import * as React from 'react'

const TypeContext = React.createContext<ActivityType>('TASK')

export interface ActivityBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ActivityType
  /** Show a left-edge accent bar with the type's color. */
  withAccent?: boolean
}

function ActivityBlockRoot({
  type = 'TASK',
  withAccent = true,
  className,
  children,
  ...props
}: ActivityBlockProps) {
  const colors = activityColors(type)
  return (
    <TypeContext.Provider value={type}>
      <div
        className={cn(
          'group relative flex h-full flex-col gap-0.5 overflow-hidden rounded-md border px-2 py-1.5 text-xs',
          colors.bg,
          colors.border,
          className,
        )}
        {...props}
      >
        {withAccent && (
          <div
            className={cn(
              'pointer-events-none absolute top-0 bottom-0 left-0 w-0.5',
              colors.accent,
            )}
          />
        )}
        {children}
      </div>
    </TypeContext.Provider>
  )
}

function Title({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const type = React.useContext(TypeContext)
  return (
    <p className={cn('truncate font-medium', activityColors(type).title, className)} {...props} />
  )
}

function Time({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const type = React.useContext(TypeContext)
  return <p className={cn('truncate', activityColors(type).meta, className)} {...props} />
}

export const ActivityBlock = Object.assign(ActivityBlockRoot, { Title, Time })
