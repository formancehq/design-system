import { InfoIcon } from 'lucide-react';

import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from '@/registry/default/ui/bubble';
import { Button } from '@/registry/default/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';

export default function BubblePopover() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-12">
      <Bubble align="end">
        <BubbleContent>Apply the new schema to the ledger.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>The schema could not be applied.</BubbleContent>
        <BubbleReactions>
          <Popover>
            <PopoverTrigger asChild className="h-auto">
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Show error details"
                className="aria-expanded:text-destructive"
              >
                <InfoIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-1 text-sm">
              <p className="font-medium">Validation failed with 1 error</p>
              <p className="text-muted-foreground">
                accounts.fees: the account has no outgoing transaction.
              </p>
            </PopoverContent>
          </Popover>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}
