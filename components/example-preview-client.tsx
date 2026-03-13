'use client';

import { Suspense } from 'react';
import type { ComponentType } from 'react';

import { Skeleton } from '@/registry/default/ui/skeleton';

export function ExamplePreviewClient({
  component: DemoComponent,
}: {
  component: React.LazyExoticComponent<ComponentType>;
}) {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center rounded-lg border p-10 bg-[image:radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px]">
      <Suspense fallback={<Skeleton className="h-20 w-60" />}>
        <DemoComponent />
      </Suspense>
    </div>
  );
}
