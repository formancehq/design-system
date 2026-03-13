'use client';

import { Progress } from '@/registry/default/ui/progress';

export default function ProgressDemo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Progress value={33} />
      <Progress value={66} />
      <Progress value={100} />
    </div>
  );
}
