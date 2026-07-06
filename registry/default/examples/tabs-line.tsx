'use client';

import {
  Tabs,
  TabsContent,
  TabsCount,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

export default function TabsLine() {
  return (
    <Tabs defaultValue="transactions" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="transactions">
          Transactions
          <TabsCount>{5}</TabsCount>
        </TabsTrigger>
        <TabsTrigger value="queries">
          Queries
          <TabsCount>{3}</TabsCount>
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
