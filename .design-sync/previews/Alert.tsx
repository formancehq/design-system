import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  Button,
} from '@formance/design-system';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';

export function Variants() {
  return (
    <div className="w-full max-w-md space-y-3">
      <Alert variant="info">
        <Info className="size-4" />
        <AlertTitle>Good to know</AlertTitle>
        <AlertDescription>
          The sandbox provisions in about 30 seconds.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert className="size-4" />
        <AlertTitle>Edition required</AlertTitle>
        <AlertDescription>
          This page requires the Enterprise Edition.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CheckCircle2 className="size-4" />
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>Your changes have been published.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function WithContent() {
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
        <p className="text-center text-xs text-muted-foreground">OR</p>
        <pre className="rounded-md border bg-muted px-3 py-2 font-mono text-xs">
          fctl stack create my-stack
        </pre>
      </AlertContent>
    </Alert>
  );
}
