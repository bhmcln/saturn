'use client'

import { NowIndicator } from '@/registry/default/ui/now-indicator'

export function NowIndicatorDemo() {
  return (
    <div className="relative h-80 w-full max-w-md overflow-hidden rounded-md border bg-background">
      <div className="absolute inset-y-0 left-0 flex w-12 flex-col justify-between border-r py-2 text-xs text-muted-foreground">
        <span className="pl-2">12 AM</span>
        <span className="pl-2">6 AM</span>
        <span className="pl-2">12 PM</span>
        <span className="pl-2">6 PM</span>
        <span className="pl-2">11 PM</span>
      </div>
      <div className="relative ml-12 h-full">
        <NowIndicator />
      </div>
    </div>
  )
}
