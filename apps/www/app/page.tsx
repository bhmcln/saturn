import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Saturn</h1>
        <ThemeToggle />
      </header>

      <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
        A shadcn/ui-style library of time-based UI components: day, week, and month views,
        scheduling, rostering, shifts. Copy what you need into your project — own the code.
      </p>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Components</h2>
        <ul className="mt-4 space-y-2">
          <li>
            <Link
              href="/docs/week-view"
              className="text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
            >
              week-view
            </Link>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Seven-day calendar with positioned events
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Install</h2>
        <pre className="mt-4 rounded-md bg-gray-900 px-4 py-3 text-sm text-gray-100">
          <code>npx saturn init</code>
        </pre>
        <pre className="mt-2 rounded-md bg-gray-900 px-4 py-3 text-sm text-gray-100">
          <code>npx saturn add week-view</code>
        </pre>
      </div>
    </main>
  )
}
