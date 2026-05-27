import { cn } from '@/lib/utils'

export function CodeBlock({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-lg border bg-code px-4 py-3 font-mono text-sm text-code-foreground',
        className,
      )}
    >
      <code>{children}</code>
    </pre>
  )
}
