'use client'

import { PeriodNavigator } from '@/registry/default/ui/period-navigator'
import { startOfWeek } from 'date-fns'
import { useState } from 'react'

export function PeriodNavigatorDemo() {
  const [periodStart, setPeriodStart] = useState(() => startOfWeek(new Date()))
  return (
    <div className="w-full max-w-2xl">
      <PeriodNavigator
        periodStart={periodStart}
        periodLengthDays={14}
        onPeriodChange={(d) => setPeriodStart(startOfWeek(d))}
      />
    </div>
  )
}
