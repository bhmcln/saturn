'use client'

import { EventCard, type EventColor } from '@/registry/default/ui/event-card'

interface Variant {
  color: EventColor
  title: string
  time: string
}

const VARIANTS: Variant[] = [
  { color: 'blue', title: 'Personal care · Mrs Patel', time: '7:30 AM' },
  { color: 'green', title: 'Medication · Mr Chen', time: '9:00 AM' },
  { color: 'pink', title: 'Wound care · Mr Davies', time: '10:00 AM' },
  { color: 'amber', title: 'Break', time: '12:30 PM' },
  { color: 'purple', title: 'Training · CPR refresher', time: '2:00 PM' },
  { color: 'gray', title: 'Travel', time: '8:30 AM' },
]

export function EventCardDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {VARIANTS.map(({ color, title, time }) => (
        <EventCard key={color} color={color}>
          <EventCard.Title>{title}</EventCard.Title>
          <EventCard.Time>{time}</EventCard.Time>
        </EventCard>
      ))}
    </div>
  )
}
