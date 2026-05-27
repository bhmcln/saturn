import { DocsSidebar } from '@/components/docs-sidebar'
import type { ReactNode } from 'react'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <DocsSidebar />
      <main className="min-w-0 px-6 py-10 lg:py-14 lg:pr-10">
        <div className="max-w-4xl">{children}</div>
      </main>
    </div>
  )
}
