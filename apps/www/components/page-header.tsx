import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export function PageHeader({ className, children, ...props }: ComponentProps<'section'>) {
  return (
    <section className={cn('border-grid', className)} {...props}>
      <div className="container flex flex-col items-center gap-3 py-12 text-center md:py-16 lg:py-20 xl:gap-5">
        {children}
      </div>
    </section>
  )
}

export function PageHeaderHeading({ className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'max-w-3xl text-balance text-3xl font-semibold tracking-tight leading-tight text-foreground lg:text-5xl lg:leading-[1.05] xl:tracking-tighter',
        className,
      )}
      {...props}
    />
  )
}

export function PageHeaderDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('max-w-2xl text-balance text-base text-muted-foreground sm:text-lg', className)}
      {...props}
    />
  )
}

export function PageActions({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-2 flex w-full items-center justify-center gap-3', className)}
      {...props}
    />
  )
}
