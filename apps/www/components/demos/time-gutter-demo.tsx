import { TimeGutter } from '@/registry/default/ui/time-gutter'

export function TimeGutterDemo() {
  return (
    <div className="flex h-96 w-32 overflow-hidden rounded-md border bg-background">
      <TimeGutter date={new Date()} headerHeight="0px" className="ring-0" />
    </div>
  )
}
