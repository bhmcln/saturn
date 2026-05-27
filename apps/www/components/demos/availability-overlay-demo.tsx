import { AvailabilityOverlay } from '@/registry/default/ui/availability-overlay'

export function AvailabilityOverlayDemo() {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-2 flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>10 PM</span>
      </div>
      <div className="relative h-16 overflow-hidden rounded-md border bg-background">
        <AvailabilityOverlay kind="unavailable" offsetPct={0} widthPct={18.75} />
        <AvailabilityOverlay kind="available" offsetPct={18.75} widthPct={50} />
        <AvailabilityOverlay kind="offShift" offsetPct={68.75} widthPct={12.5} />
        <AvailabilityOverlay kind="available" offsetPct={81.25} widthPct={12.5} />
        <AvailabilityOverlay kind="unavailable" offsetPct={93.75} widthPct={6.25} />
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        <Swatch kind="available" label="Available" />
        <Swatch kind="offShift" label="Off shift" />
        <Swatch kind="unavailable" label="Unavailable" />
      </div>
    </div>
  )
}

function Swatch({
  kind,
  label,
}: {
  kind: 'available' | 'unavailable' | 'offShift'
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="relative size-3 overflow-hidden rounded">
        <AvailabilityOverlay kind={kind} offsetPct={0} widthPct={100} />
      </span>
      {label}
    </span>
  )
}
