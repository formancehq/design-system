'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

function Count({ children }: { children: number }) {
  return (
    <span className="rounded-full bg-foreground/10 px-1.5 text-[10px] font-normal tabular-nums">
      {children}
    </span>
  );
}

export default function TabsLine() {
  return (
    <Tabs defaultValue="transactions" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="transactions">
          Transactions
          <Count>{5}</Count>
        </TabsTrigger>
        <TabsTrigger value="queries">
          Queries
          <Count>{3}</Count>
        </TabsTrigger>
        <TabsTrigger value="metadata">Metadata</TabsTrigger>
      </TabsList>
      <TabsContent
        value="transactions"
        className="p-4 text-sm text-muted-foreground"
      >
        Browse and filter all ledger transactions.
      </TabsContent>
      <TabsContent
        value="queries"
        className="p-4 text-sm text-muted-foreground"
      >
        Run and inspect saved queries.
      </TabsContent>
      <TabsContent
        value="metadata"
        className="p-4 text-sm text-muted-foreground"
      >
        Inspect and edit transaction metadata.
      </TabsContent>
    </Tabs>
  );
}
