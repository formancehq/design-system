'use client';

import { Suspense } from 'react';

import { cn } from '@/lib/utils';
import { findDemo } from '@/config/registry-demos';
import { Skeleton } from '@/registry/default/ui/skeleton';

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
} as const;

export function ComponentPreviewClient({
  name,
  showGrid = true,
  align = 'center',
}: {
  name: string;
  showGrid?: boolean;
  align?: 'start' | 'center' | 'end';
}) {
  const demo = findDemo(name);
  if (!demo) {
    return (
      <div className="flex items-center justify-center p-10 text-sm text-muted-foreground">
        No demo available for &quot;{name}&quot;
      </div>
    );
  }

  const DemoComponent = demo.component;

  return (
    <div
      className={cn(
        'flex min-h-[200px] w-full justify-center p-10',
        alignClasses[align],
        showGrid &&
          'bg-[image:radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px]'
      )}
    >
      <Suspense fallback={<Skeleton className="h-20 w-60" />}>
        <DemoComponent />
      </Suspense>
    </div>
  );
}
