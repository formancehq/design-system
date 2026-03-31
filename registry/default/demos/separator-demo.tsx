'use client';

import { Separator } from '@/registry/default/ui/separator';

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-md space-y-1">
      <div>
        <h4 className="text-sm font-medium">Formance Design System</h4>
        <p className="text-sm text-muted-foreground">
          Open-source component registry.
        </p>
      </div>
      <Separator />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Brand</span>
      </div>
    </div>
  );
}
