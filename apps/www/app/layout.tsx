import { SiteHeader } from '@/components/site-header'
import { fontVariables } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Saturn — Time-based UI components',
    template: '%s · Saturn',
  },
  description:
    'A shadcn/ui-style library of time-based UI components — day, week, and month views, scheduling, rostering, shifts. Copy what you need into your project.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className={cn('min-h-svh bg-background font-sans text-foreground antialiased')}>
        <Providers>
          <div className="relative flex min-h-svh flex-col">
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
