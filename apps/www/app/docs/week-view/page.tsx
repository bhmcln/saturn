import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { WeekViewDemo } from './demo'

export default async function WeekViewDocsPage() {
  const source = await readFile(join(process.cwd(), 'registry/default/ui/week-view.tsx'), 'utf-8')

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
          ← Saturn
        </Link>
        <ThemeToggle />
      </header>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight">week-view</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Seven-day calendar view with a time grid and positioned events. Compound parts:{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-white/10">WeekView.Header</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-white/10">WeekView.Body</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-white/10">WeekView.Title</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-white/10">WeekView.Navigation</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-white/10">WeekView.DayLabels</code>,{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-white/10">WeekView.Grid</code>.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Install</h2>
        <pre className="mt-3 overflow-x-auto rounded-md bg-gray-900 px-4 py-3 text-sm text-gray-100">
          <code>npx saturn add week-view</code>
        </pre>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="mt-3 h-[640px] overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
          <WeekViewDemo />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Source</h2>
        <pre className="mt-3 max-h-[480px] overflow-auto rounded-md bg-gray-900 px-4 py-3 text-xs text-gray-100">
          <code>{source}</code>
        </pre>
      </section>
    </main>
  )
}
