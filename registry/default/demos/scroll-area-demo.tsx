'use client';

import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { Separator } from '@/registry/default/ui/separator';

const ITEMS = Array.from({ length: 20 }, (_, i) => `Transaction #${i + 1}`);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-48 w-full max-w-xs rounded-md border">
      <div className="p-4">
        <p className="mb-3 text-sm font-medium">Recent Transactions</p>
        {ITEMS.map((item) => (
          <div key={item}>
            <div className="py-2 text-sm">{item}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
