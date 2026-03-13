'use client';

import { Suspense } from 'react';
import type { ComponentType } from 'react';

import { registryDemos } from '@/config/registry-demos';
import { Skeleton } from '@/registry/default/ui/skeleton';

function ExamplePreviewClient({
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

export function ExamplesSection({
  registryName,
  codeBlocks,
}: {
  registryName: string;
  codeBlocks: Record<string, React.ReactNode>;
}) {
  const examples = registryDemos[registryName]?.examples;
  if (!examples?.length) return null;

  return (
    <div className="space-y-8">
      {examples.map((example) => (
        <div key={example.title} className="space-y-4">
          <h3 className="scroll-m-20 font-sans text-xl font-semibold tracking-tight">
            {example.title}
          </h3>
          <ExamplePreviewClient component={example.component} />
          {codeBlocks[example.sourceFile]}
        </div>
      ))}
    </div>
  );
}
