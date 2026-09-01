import {
  Badge,
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@formance/design-system';

export function InsideCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>sandbox-eu-west</CardTitle>
        <CardDescription>Region eu-west-1 · v2.4.1</CardDescription>
        <CardAction>
          <Badge variant="valid">Active</Badge>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
