import { DocsSidebar } from '@/components/docs-sidebar'
import type { ReactNode } from 'react'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container flex gap-10">
      <DocsSidebar />
      <div className="min-w-0 flex-1 py-8 lg:py-12">{children}</div>
    </div>
  )
}
