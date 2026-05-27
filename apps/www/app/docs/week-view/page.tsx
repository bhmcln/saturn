import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { CodeBlock } from '@/components/code-block'
import { ComponentPreview } from '@/components/component-preview'
import { WeekViewDemo } from '@/components/demos/week-view-demo'

export default async function WeekViewDocsPage() {
  const source = await readFile(join(process.cwd(), 'registry/default/ui/week-view.tsx'), 'utf-8')

  return (
    <article className="container max-w-4xl py-10 lg:py-16">
      <header className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">Components</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground lg:text-4xl">
          week-view
        </h1>
        <p className="mt-3 text-base text-muted-foreground lg:text-lg">
          A seven-day calendar view with a time grid and positioned events.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Installation</h2>
        <div className="mt-3">
          <CodeBlock>npx saturn add week-view</CodeBlock>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Preview</h2>
        <ComponentPreview
          preview={
            <div className="h-[560px] w-full">
              <WeekViewDemo />
            </div>
          }
          source={source}
          filename="components/ui/week-view.tsx"
          previewClassName="p-0"
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Compound parts</h2>
        <p className="mt-2 text-muted-foreground">
          State flows top-down via React context. Each part is independently styleable.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            ['WeekView', 'Root + context provider'],
            ['WeekView.Header', 'Flex container for the toolbar'],
            ['WeekView.Title', 'Month + year label'],
            ['WeekView.Navigation', 'Prev / today / next buttons'],
            ['WeekView.Body', 'Scrollable grid container'],
            ['WeekView.DayLabels', 'Sticky-top day-of-week row'],
            ['WeekView.Grid', 'Time grid + hour gutter + positioned events'],
          ].map(([name, desc]) => (
            <li key={name} className="rounded-lg border bg-card px-4 py-3 text-sm">
              <code className="font-mono text-foreground">{name}</code>
              <span className="ml-2 text-muted-foreground">— {desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
