'use client'

import { DatePicker } from '@/registry/default/ui/date-picker'
import { useState } from 'react'

export function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>()
  return <DatePicker value={date} onValueChange={setDate} />
}
