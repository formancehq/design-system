'use client';

import { Suspense } from 'react';

import { registryDemos } from '@/config/registry-demos';
import { Skeleton } from '@/registry/default/ui/skeleton';

export function ComponentPreviewClient({
  name,
  showGrid = true,
  align = 'center',
}: {
  name: string;
  showGrid?: boolean;
  align?: 'start' | 'center' | 'end';
}) {
  const demo = registryDemos[name];
  if (!demo) {
    return (
      <div className="flex items-center justify-center p-10 text-sm text-muted-foreground">
        No demo available for "{name}"
      </div>
    );
  }

  const DemoComponent = demo.component;

  const alignClass =
    align === 'start' ? 'items-start' : align === 'end' ? 'items-end' : 'items-center';

  return (
    <div
      className={`flex min-h-[200px] w-full justify-center ${alignClass} rounded-lg border p-10 ${
        showGrid
          ? 'bg-[image:radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px]'
          : ''
      }`}
    >
      <Suspense fallback={<Skeleton className="h-20 w-60" />}>
        <DemoComponent />
      </Suspense>
    </div>
  );
}
