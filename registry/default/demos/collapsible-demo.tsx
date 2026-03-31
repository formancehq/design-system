'use client';

import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/registry/default/ui/collapsible';

export default function CollapsibleDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-sm space-y-2"
    >
      <div className="flex items-center justify-between rounded-md border px-4 py-2">
        <span className="text-sm font-medium">3 services available</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 text-sm">Ledger</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">Payments</div>
        <div className="rounded-md border px-4 py-2 text-sm">Wallets</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
