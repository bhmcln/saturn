import { docsNav } from '@/lib/docs-nav'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DocsIndexPage() {
  return (
    <article>
      <header className="mb-10">
        <p className="text-sm font-medium text-muted-foreground">Getting Started</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight lg:text-4xl">Introduction</h1>
        <p className="mt-3 text-base text-muted-foreground lg:text-lg">
          Saturn is a shadcn/ui-style library of time-based UI components. Copy the source you need
          into your project, own the code, theme it your way.
        </p>
      </header>

      <section className="prose prose-sm dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold tracking-tight">What's in the catalog?</h2>
        <p className="mt-2 text-muted-foreground">
          18 components grouped by tier: <em>foundations</em> (date helpers, hooks),{' '}
          <em>primitives</em> (one rendering responsibility each), <em>views</em> (compound
          multi-part components for whole calendar surfaces), and <em>inputs</em> (form controls
          that pair with the views).
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-8">
        {docsNav
          .filter((g) => g.title !== 'Getting Started')
          .map((group) => (
            <div key={group.title}>
              <h2 className="text-xl font-semibold tracking-tight">{group.title}</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between rounded-md border bg-card px-3 py-2 transition-colors hover:bg-accent"
                    >
                      <span className="font-medium text-foreground">{item.title}</span>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </section>
    </article>
  )
}
