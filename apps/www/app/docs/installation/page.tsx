import { CodeBlock } from '@/components/code-block'

export default function InstallationPage() {
  return (
    <article>
      <header className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">Getting Started</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight lg:text-4xl">Installation</h1>
        <p className="mt-3 text-base text-muted-foreground lg:text-lg">
          Saturn assumes a Next.js / Vite / React project with Tailwind CSS v4 and shadcn-style
          design tokens (--background, --foreground, --primary, etc.).
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">1. Initialise components.json</h2>
        <p className="mt-2 text-muted-foreground">
          Once per project. The CLI writes <code className="font-mono">components.json</code>{' '}
          recording where you want components, lib, and hooks to be installed.
        </p>
        <div className="mt-3">
          <CodeBlock>npx saturn init</CodeBlock>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">2. Add components</h2>
        <p className="mt-2 text-muted-foreground">
          The CLI fetches the requested component plus its transitive Saturn dependencies and writes
          them into your aliased paths.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <CodeBlock>npx saturn add week-view</CodeBlock>
          <CodeBlock>npx saturn add day-view month-view agenda-view</CodeBlock>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">3. Install npm peers</h2>
        <p className="mt-2 text-muted-foreground">
          The CLI prints the npm packages each component needs. Install them with your package
          manager:
        </p>
        <div className="mt-3">
          <CodeBlock>
            pnpm add date-fns lucide-react clsx tailwind-merge class-variance-authority
          </CodeBlock>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Token assumptions</h2>
        <p className="mt-2 text-muted-foreground">
          Saturn components use semantic Tailwind utility tokens like{' '}
          <code className="font-mono">bg-background</code>,{' '}
          <code className="font-mono">text-muted-foreground</code>,{' '}
          <code className="font-mono">border</code>, and{' '}
          <code className="font-mono">bg-primary</code>. If your project doesn't already have
          shadcn's CSS-variable theme set up, run <code className="font-mono">npx shadcn init</code>{' '}
          first — Saturn's components inherit those tokens automatically.
        </p>
      </section>
    </article>
  )
}
