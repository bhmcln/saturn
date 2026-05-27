import { PeriodBoundaryMarker } from '@/registry/default/ui/period-boundary-marker'

export function PeriodBoundaryMarkerDemo() {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>Mar 3</span>
        <span>Mar 10</span>
        <span>Mar 17</span>
        <span>Mar 24</span>
        <span>Mar 31</span>
      </div>
      <div className="relative h-16 overflow-hidden rounded-md border bg-card pt-6">
        <PeriodBoundaryMarker offsetPct={0} label="P1" />
        <PeriodBoundaryMarker offsetPct={25} />
        <PeriodBoundaryMarker offsetPct={50} label="P2" />
        <PeriodBoundaryMarker offsetPct={75} />
        <PeriodBoundaryMarker offsetPct={100} label="P3" />
      </div>
    </div>
  )
}
