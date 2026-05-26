'use client';

import {
  AlertCircle,
  CheckCircle2,
  Info,
  Terminal,
  TriangleAlert,
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/registry/default/ui/alert';

export default function AlertDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <Alert>
        <Terminal className="size-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components using the CLI.
        </AlertDescription>
      </Alert>
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
