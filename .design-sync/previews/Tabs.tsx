import {
  Tabs,
  TabsContent,
  TabsCount,
  TabsList,
  TabsTrigger,
} from '@formance/design-system';

export function Default() {
  return (
    <Tabs defaultValue="ledgers" className="w-full max-w-md">
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
    </Tabs>
  );
}

export function Line() {
  return (
    <Tabs defaultValue="transactions" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="transactions">
          Transactions
          <TabsCount>{128}</TabsCount>
        </TabsTrigger>
        <TabsTrigger value="queries">
          Queries
          <TabsCount>{3}</TabsCount>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="transactions"
        className="p-4 text-sm text-muted-foreground"
      >
        128 transactions posted in the last 24 hours.
      </TabsContent>
    </Tabs>
  );
}

export function Vertical() {
  return (
    <Tabs
      defaultValue="general"
      orientation="vertical"
      className="w-full max-w-md flex-row gap-4"
    >
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="text-sm text-muted-foreground">
        Stack name, region and version.
      </TabsContent>
    </Tabs>
  );
}
