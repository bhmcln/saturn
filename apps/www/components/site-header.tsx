import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { siteConfig } from '@/lib/site-config'
import { Github } from 'lucide-react'
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[var(--header-height)] items-center">
        <MainNav />
        <div className="ml-auto flex items-center gap-1">
          <Link
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Github className="size-4" />
          </Link>
          <div className="mx-1 h-4 w-px bg-border" aria-hidden />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
