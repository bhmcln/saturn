'use client'

import { TimePicker } from '@/registry/default/ui/time-picker'
import { useState } from 'react'

export function TimePickerDemo() {
  const [value, setValue] = useState('09:00')
  return (
    <div className="flex items-center gap-3">
      <TimePicker value={value} onValueChange={setValue} step={15} />
      <span className="text-sm text-muted-foreground">value: {value || '—'}</span>
    </div>
  )
}
