'use client'

import { Button } from '@/registry/default/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip'

export function TooltipDemo() {
  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">Mrs Patel · Personal care</p>
          <p className="opacity-80">7:30 AM – 8:30 AM</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
