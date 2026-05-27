'use client'

import { MiniCalendar } from '@/registry/default/ui/mini-calendar'
import { useState } from 'react'

export function MiniCalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(() => new Date())
  return (
    <MiniCalendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
  )
}
