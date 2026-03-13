'use client';

import { Button } from '@/registry/default/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip';

export default function TooltipDemo() {
  return (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          This is a tooltip
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost">Another one</Button>
        </TooltipTrigger>
        <TooltipContent>
          Tooltips use the primary color
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
