'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

interface ComponentPreviewProps {
  preview: React.ReactNode
  source: string
  filename?: string
  className?: string
  previewClassName?: string
}

export function ComponentPreview({
  preview,
  source,
  filename,
  className,
  previewClassName,
}: ComponentPreviewProps) {
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview')

  return (
    <div
      className={cn(
        'group relative my-6 flex flex-col overflow-hidden rounded-xl border bg-card',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex gap-1">
          <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
            Preview
          </TabButton>
          <TabButton active={tab === 'code'} onClick={() => setTab('code')}>
            Code
          </TabButton>
        </div>
        {filename && <span className="font-mono text-xs text-muted-foreground">{filename}</span>}
      </div>

      {tab === 'preview' ? (
        <div className={cn('relative flex min-h-[480px] w-full', previewClassName)}>{preview}</div>
      ) : (
        <pre className="m-0 max-h-[640px] overflow-auto bg-code px-5 py-4 text-xs leading-relaxed text-code-foreground">
          <code className="font-mono">{source}</code>
        </pre>
      )}
    </div>
  )
}

function TabButton({
  active,
  ...props
}: { active: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-active={active}
      className="rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
      {...props}
    />
  )
}
