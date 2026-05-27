import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function MainNav({ className }: { className?: string }) {
  return (
    <nav className={cn('flex items-center gap-6 lg:gap-8', className)}>
      <Link href="/" className="flex items-center gap-2">
        <SaturnMark className="size-5" />
        <span className="font-semibold tracking-tight">{siteConfig.name}</span>
      </Link>
      <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition-colors hover:text-foreground"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function SaturnMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-20 12 12)" />
    </svg>
  )
}
