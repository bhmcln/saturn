'use client'

import { type ViewMode, ViewModeSwitcher } from '@/registry/default/ui/view-mode-switcher'
import { useState } from 'react'

export function ViewModeSwitcherDemo() {
  const [view, setView] = useState<ViewMode>('week')
  return (
    <div className="flex items-center gap-3">
      <ViewModeSwitcher
        value={view}
        onValueChange={setView}
        views={['day', 'week', 'month', 'agenda', 'timeline']}
      />
      <span className="text-sm text-muted-foreground">selected: {view}</span>
    </div>
  )
}
