'use client';

import { Progress } from '@/registry/default/ui/progress';

export default function ProgressIndeterminate() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm">
          Importing transactions…
        </span>
        <Progress aria-label="Importing transactions" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm">Queued</span>
        <Progress value={0} aria-label="Queued" />
      </div>
    </div>
  );
}
