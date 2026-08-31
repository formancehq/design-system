import { Alert, AlertDescription, AlertTitle } from '@formance/design-system';
import { TriangleAlert } from 'lucide-react';

export function InsideAlert() {
  return (
    <Alert variant="warning" className="w-full max-w-md">
      <TriangleAlert className="size-4" />
      <AlertTitle>Edition required</AlertTitle>
      <AlertDescription>
        This page requires the Enterprise Edition.
      </AlertDescription>
    </Alert>
  );
}
