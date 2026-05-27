import { Announcement } from '@/components/announcement'
import { CodeBlock } from '@/components/code-block'
import { AppointmentCalendarDemo } from '@/components/demos/appointment-calendar-demo'
import { RosterDayDetailDemo } from '@/components/demos/roster-day-detail-demo'
import { RosterPlannerDemo } from '@/components/demos/roster-planner-demo'
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
        <Announcement>v0.5 · Three flagship blocks</Announcement>
        <PageHeaderHeading>Time-based UI, the way you would have built it.</PageHeaderHeading>
        <PageHeaderDescription>
          A shadcn/ui-style library for rostering, scheduling, and time-based UI. Drag, resize, and
          create across day / week / month / timeline views. Copy the source you need, own the code,
          theme it your way.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/docs/roster-planner" className={buttonVariants()}>
            See the roster planner
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
        <BlockSection
          tag="Roster planner"
          label="Whole team's week — drag across days, drop on another worker"
          height="h-[720px]"
          href="/docs/roster-planner"
        >
          <RosterPlannerDemo />
        </BlockSection>

        <BlockSection
          tag="Day detail"
          label="One day across all workers — each row a horizontal timeline"
          height="h-[640px]"
          href="/docs/roster-day-detail"
        >
          <RosterDayDetailDemo />
        </BlockSection>

        <BlockSection
          tag="Appointment calendar"
          label="Personal scheduling — drag-to-create, edge resize, + New button"
          height="h-[640px]"
          href="/docs/appointment-calendar"
        >
          <AppointmentCalendarDemo />
        </BlockSection>
      </section>

      <section className="container pb-20">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          Install
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <CodeBlock>npx saturn init</CodeBlock>
          <CodeBlock>npx saturn add roster-planner</CodeBlock>
        </div>
      </section>
    </>
  )
}

function BlockSection({
  tag,
  label,
  height,
  href,
  children,
}: {
  tag: string
  label: string
  height: string
  href: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3">
        <span className="rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-background uppercase">
          {tag}
        </span>
        <h2 className="text-sm text-muted-foreground">{label}</h2>
        <Link
          href={href}
          className="ml-auto text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Docs →
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className={height}>{children}</div>
      </div>
    </div>
  )
}
