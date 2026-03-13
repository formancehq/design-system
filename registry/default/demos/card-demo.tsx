'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/registry/default/ui/card';
import { Button } from '@/registry/default/ui/button';

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Ledger</CardTitle>
        <CardDescription>Deploy a new ledger to your Formance stack.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Configure your ledger settings and start recording transactions.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Create</Button>
      </CardFooter>
    </Card>
  );
}
