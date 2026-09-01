import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@formance/design-system';

export function InsideCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Ledger totals</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Accounts</dt>
          <dd className="font-mono">1,204</dd>
          <dt className="text-muted-foreground">Transactions</dt>
          <dd className="font-mono">128,904</dd>
        </dl>
      </CardContent>
    </Card>
  );
}
