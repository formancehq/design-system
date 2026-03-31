'use client';

import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area';

const CONNECTORS = [
  { name: 'Stripe', status: 'Active' },
  { name: 'Wise', status: 'Active' },
  { name: 'Modulr', status: 'Paused' },
  { name: 'CurrencyCloud', status: 'Active' },
  { name: 'Moneycorp', status: 'Error' },
  { name: 'Banking Circle', status: 'Active' },
  { name: 'Adyen', status: 'Active' },
  { name: 'Mangopay', status: 'Paused' },
];

export default function ScrollAreaHorizontalExample() {
  return (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {CONNECTORS.map((connector) => (
          <figure key={connector.name} className="shrink-0">
            <div className="bg-muted flex h-20 w-32 items-center justify-center overflow-hidden rounded-md">
              <span className="text-sm font-medium">{connector.name}</span>
            </div>
            <figcaption className="text-muted-foreground pt-2 text-xs">
              Status:{' '}
              <span className="text-foreground font-semibold">
                {connector.status}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
