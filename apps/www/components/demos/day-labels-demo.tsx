import { getWeekDays } from '@/registry/default/lib/time'
import { DayLabels } from '@/registry/default/ui/day-labels'
import { startOfWeek } from 'date-fns'

export function DayLabelsDemo() {
  const days = getWeekDays(startOfWeek(new Date()))
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-md border">
      <DayLabels days={days} gutterWidth="0px" className="ring-0" />
    </div>
  )
}
