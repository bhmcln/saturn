import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { CodeBlock } from '@/components/code-block'
import { ComponentPreview } from '@/components/component-preview'
import { getDemo } from '@/components/demos'
import { cn } from '@/lib/utils'
import { registry } from '@/registry'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return registry.map((item) => ({ slug: item.name }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

const TYPE_LABEL: Record<string, string> = {
  'registry:lib': 'Foundation',
  'registry:hook': 'Hook',
  'registry:ui': 'Component',
  'registry:component': 'Component',
  'registry:block': 'Block',
  'registry:example': 'Example',
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params
  const item = registry.find((i) => i.name === slug)
  if (!item) notFound()

  const sources = await Promise.all(
    item.files.map(async (file) => ({
      path: file.path,
      content: await readFile(join(process.cwd(), 'registry/default', file.path), 'utf-8'),
    })),
  )
  const primary = sources[0]
  if (!primary) notFound()

  const demo = getDemo(item.name)
  const demoSource = demo
    ? await readFile(join(process.cwd(), 'components/demos', demo.filename), 'utf-8')
    : null

  return (
    <article>
      <header className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">
          {TYPE_LABEL[item.type] ?? item.type}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight lg:text-4xl">{item.name}</h1>
        {item.description && (
          <p className="mt-3 text-base text-muted-foreground lg:text-lg">{item.description}</p>
        )}
      </header>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Installation</h2>
        <div className="mt-3">
          <CodeBlock>npx saturn add {item.name}</CodeBlock>
        </div>
      </section>

      {demo && demoSource && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Preview</h2>
          <ComponentPreview
            preview={demo.element}
            source={demoSource}
            filename={`components/demos/${demo.filename}`}
            previewClassName={cn(demo.previewClassName)}
          />
        </section>
      )}

      <DependenciesSection
        dependencies={item.dependencies}
        registryDependencies={item.registryDependencies}
      />

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Source</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {sources.length === 1 ? primary.path : `${sources.length} files`}
        </p>
        {sources.map((src) => (
          <details key={src.path} className="mt-3 overflow-hidden rounded-md border bg-card">
            <summary className="cursor-pointer border-b px-4 py-2 font-mono text-xs text-muted-foreground hover:bg-muted">
              {src.path}
            </summary>
            <pre className="max-h-[480px] overflow-auto bg-code px-4 py-3 text-xs leading-relaxed text-code-foreground">
              <code className="font-mono">{src.content}</code>
            </pre>
          </details>
        ))}
      </section>
    </article>
  )
}

function DependenciesSection({
  dependencies,
  registryDependencies,
}: {
  dependencies?: string[]
  registryDependencies?: string[]
}) {
  const hasNpm = (dependencies?.length ?? 0) > 0
  const hasRegistry = (registryDependencies?.length ?? 0) > 0
  if (!hasNpm && !hasRegistry) return null

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">Dependencies</h2>
      <div className="mt-3 grid gap-6 sm:grid-cols-2">
        {hasNpm && (
          <div>
            <h3 className="text-sm font-medium text-foreground">npm</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {dependencies?.map((dep) => (
                <li
                  key={dep}
                  className="rounded-md border bg-muted px-2 py-1 font-mono text-xs text-foreground"
                >
                  {dep}
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasRegistry && (
          <div>
            <h3 className="text-sm font-medium text-foreground">Saturn</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {registryDependencies?.map((dep) => (
                <li key={dep}>
                  <Link
                    href={`/docs/${dep}`}
                    className="inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-1 font-mono text-xs text-foreground transition-colors hover:bg-accent"
                  >
                    {dep}
                    <ArrowRight className="size-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
