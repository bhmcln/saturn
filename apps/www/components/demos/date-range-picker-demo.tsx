'use client'

import { type DateRange, DateRangePicker } from '@/registry/default/ui/date-range-picker'
import { useState } from 'react'

export function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange | undefined>()
  return <DateRangePicker value={range} onValueChange={setRange} />
}
