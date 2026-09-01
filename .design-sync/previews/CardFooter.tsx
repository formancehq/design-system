import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@formance/design-system';

export function InsideCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Ledgers are created instantly and cannot be renamed.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}
