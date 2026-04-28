'use client';

import { Button } from '@/registry/default/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';

export default function TooltipDisabledButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex">
          <Button disabled>Disabled</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        This action is currently unavailable
      </TooltipContent>
    </Tooltip>
  );
}
