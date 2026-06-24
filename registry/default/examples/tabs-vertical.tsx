'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

export default function TabsVertical() {
  return (
    <Tabs
      defaultValue="ledgers"
      orientation="vertical"
      className="w-full max-w-md"
    >
      <TabsList>
        <TabsTrigger value="ledgers">Ledgers</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="wallets">Wallets</TabsTrigger>
      </TabsList>
      <TabsContent
        value="ledgers"
        className="p-4 text-sm text-muted-foreground"
      >
        Manage your ledgers and transactions.
      </TabsContent>
      <TabsContent
        value="payments"
        className="p-4 text-sm text-muted-foreground"
      >
        View and process payments.
      </TabsContent>
      <TabsContent
        value="wallets"
        className="p-4 text-sm text-muted-foreground"
      >
        Configure wallet settings.
      </TabsContent>
    </Tabs>
  );
}
