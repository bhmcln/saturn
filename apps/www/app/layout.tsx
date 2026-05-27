import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Saturn — Time-based UI components',
  description: 'A shadcn/ui-style library of time-based UI components.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 antialiased dark:bg-gray-900 dark:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
