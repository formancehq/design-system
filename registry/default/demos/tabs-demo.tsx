'use client';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/registry/default/ui/tabs';

export default function TabsDemo() {
  return (
    <Tabs defaultValue="ledgers" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="ledgers">Ledgers</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="wallets">Wallets</TabsTrigger>
      </TabsList>
      <TabsContent
        value="ledgers"
        className="text-sm text-muted-foreground p-4"
      >
        Manage your ledgers and transactions.
      </TabsContent>
      <TabsContent
        value="payments"
        className="text-sm text-muted-foreground p-4"
      >
        View and process payments.
      </TabsContent>
      <TabsContent
        value="wallets"
        className="text-sm text-muted-foreground p-4"
      >
        Configure wallet settings.
      </TabsContent>
    </Tabs>
  );
}
