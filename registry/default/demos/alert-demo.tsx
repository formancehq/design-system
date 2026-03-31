'use client';

import { AlertCircle, Terminal } from 'lucide-react';
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
