import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  Button,
} from '@formance/design-system';
import { AlertCircle } from 'lucide-react';

export function InsideAlert() {
  return (
    <Alert variant="destructive" className="w-full max-w-md">
      <AlertCircle className="size-4" />
      <AlertTitle>No stack found</AlertTitle>
      <AlertDescription>
        You can create a stack from the portal or using fctl.
      </AlertDescription>
      <AlertContent>
        <Button variant="primary" size="sm" className="w-full">
          Install from Portal
        </Button>
        <p className="text-center text-xs text-muted-foreground">OR</p>
        <pre className="rounded-md border bg-muted px-3 py-2 font-mono text-xs">
          fctl stack create my-stack
        </pre>
      </AlertContent>
    </Alert>
  );
}
