import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
} from '@formance/design-system';

export function CreateLedger() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Ledger</CardTitle>
        <CardDescription>
          Deploy a new ledger to your Formance stack.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Configure your ledger settings and start recording transactions.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="primary">Create</Button>
      </CardFooter>
    </Card>
  );
}

export function WithAction() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>sandbox-eu-west</CardTitle>
        <CardDescription>Region eu-west-1 · v2.4.1</CardDescription>
        <CardAction>
          <Badge variant="valid">Active</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Ledgers</dt>
          <dd className="font-mono">4</dd>
          <dt className="text-muted-foreground">Transactions</dt>
          <dd className="font-mono">128,904</dd>
        </dl>
      </CardContent>
    </Card>
  );
}
