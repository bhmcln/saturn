import { Announcement } from '@/components/announcement'
import { CodeBlock } from '@/components/code-block'
import { CalendarDemo } from '@/components/demos/calendar-demo'
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header'
import { buttonVariants } from '@/registry/default/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <PageHeader>
        <Announcement>Now in preview · week-view</Announcement>
        <PageHeaderHeading>Time-based UI, the way you would have built it.</PageHeaderHeading>
        <PageHeaderDescription>
          A shadcn/ui-style library of day, week, and month views, scheduling, and rostering
          primitives. Copy the source you need, own the code, theme it your way.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/docs/week-view" className={buttonVariants()}>
            Browse components
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="https://github.com/hamish-mclean/saturn"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: 'outline' })}
          >
            GitHub
          </Link>
        </PageActions>
      </PageHeader>

      <section className="container py-10">
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="h-[640px]">
            <CalendarDemo />
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Install
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <CodeBlock>npx saturn init</CodeBlock>
          <CodeBlock>npx saturn add week-view</CodeBlock>
        </div>
      </section>
    </>
  )
}
