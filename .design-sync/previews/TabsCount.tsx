import {
  Tabs,
  TabsContent,
  TabsCount,
  TabsList,
  TabsTrigger,
} from '@formance/design-system';

export function InsideTabs() {
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
        <TabsTrigger value="errors">
          Errors
          <TabsCount>{0}</TabsCount>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="transactions"
        className="p-4 text-sm text-muted-foreground"
      >
        The count chip sits inline in the trigger label.
      </TabsContent>
    </Tabs>
  );
}
