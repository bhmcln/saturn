import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function Announcement({
  href = '/docs/week-view',
  children = 'Introducing week-view',
  className,
}: {
  href?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
        className,
      )}
    >
      {children}
      <ArrowRight className="size-3" />
    </Link>
  )
}
