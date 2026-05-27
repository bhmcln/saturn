'use client'

import { EVENT_COLORS, EventCard } from '@/registry/default/ui/event-card'

export function EventCardDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
      {EVENT_COLORS.map((color) => (
        <EventCard key={color} color={color}>
          <EventCard.Title>{color.replace(/^./, (c) => c.toUpperCase())} event</EventCard.Title>
          <EventCard.Time>10:00 AM</EventCard.Time>
        </EventCard>
      ))}
    </div>
  )
}
