'use client';

import { Button } from '@/registry/default/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/default/ui/card';

export default function CardDemo() {
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
