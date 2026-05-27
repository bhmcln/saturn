import { Announcement } from '@/components/announcement'
import { CodeBlock } from '@/components/code-block'
import { CalendarDemo } from '@/components/demos/calendar-demo'
import { TimelineViewDemo } from '@/components/demos/timeline-view-demo'
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
        <Announcement>v0.4 · Drag to move, resize, and create</Announcement>
        <PageHeaderHeading>Time-based UI, the way you would have built it.</PageHeaderHeading>
        <PageHeaderDescription>
          A shadcn/ui-style library of day, week, month, and timeline views with drag-to-
          reschedule, edge resize, and drag-to-create baked in. Copy the source you need, own the
          code, theme it your way.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/docs/timeline-view" className={buttonVariants()}>
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

      <section className="container space-y-10 py-10">
        <div>
          <h2 className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Calendar — one person's week
          </h2>
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="h-[640px]">
              <CalendarDemo />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Timeline — many workers, one day
          </h2>
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="h-[480px]">
              <TimelineViewDemo />
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          Install
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <CodeBlock>npx saturn init</CodeBlock>
          <CodeBlock>npx saturn add timeline-view</CodeBlock>
        </div>
      </section>
    </>
  )
}
