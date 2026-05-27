import { Button } from '@/registry/default/ui/button'
import { ArrowRight } from 'lucide-react'

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button size="sm">
        Small
        <ArrowRight />
      </Button>
      <Button size="lg">Large</Button>
    </div>
  )
}
