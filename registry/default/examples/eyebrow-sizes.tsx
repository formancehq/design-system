'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowSizes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow size="xs" withSquare={false}>_Extra Small/</Eyebrow>
      <Eyebrow size="sm" withSquare={false}>_Small/</Eyebrow>
      <Eyebrow size="md" withSquare={false}>_Medium/</Eyebrow>
      <Eyebrow size="lg" withSquare={false}>_Large/</Eyebrow>
    </div>
  );
}
