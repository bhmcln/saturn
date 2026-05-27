'use client'

import { docsNav } from '@/lib/docs-nav'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DocsSidebar() {
  const pathname = usePathname()
  return (
    <aside className="sticky top-[var(--header-height)] hidden h-[calc(100svh-var(--header-height))] w-64 shrink-0 overflow-y-auto border-r lg:block">
      <nav className="flex flex-col gap-6 py-8 pr-6">
        {docsNav.map((group) => (
          <div key={group.title}>
            <h2 className="mb-2 px-2 text-sm font-semibold tracking-tight text-foreground">
              {group.title}
            </h2>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-sm transition-colors',
                        active
                          ? 'bg-muted font-medium text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
