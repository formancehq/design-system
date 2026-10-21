import { CheckIcon } from 'lucide-react';

import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';

export default function BubbleTooltip() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-12">
      <Bubble variant="secondary">
        <BubbleContent>Did you remove the unused fees account?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Yes, I removed it from the schema.</BubbleContent>
        <BubbleReactions className="p-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-xs" aria-label="Read">
                <CheckIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Read on Jan 5, 2026 at 4:32 PM</TooltipContent>
          </Tooltip>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}
