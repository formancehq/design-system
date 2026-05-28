'use client';

import { AlertCircle } from 'lucide-react';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
} from '@/registry/default/ui/alert';
import { Button } from '@/registry/default/ui/button';

export default function AlertWithContent() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="size-4" />
      <AlertTitle>No stack found</AlertTitle>
      <AlertDescription>
        You can create a stack from the portal or using fctl.
      </AlertDescription>
      <AlertContent>
        <Button variant="primary" size="sm" className="w-full">
          Install from Portal
        </Button>
        <p className="text-center text-muted-foreground text-xs">OR</p>
        <pre className="rounded-md border bg-muted px-3 py-2 text-xs font-mono">
          fctl stack create my-stack
        </pre>
      </AlertContent>
    </Alert>
  );
}
