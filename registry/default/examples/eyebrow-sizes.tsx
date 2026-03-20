'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowSizes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow size="xs">_Extra Small/</Eyebrow>
      <Eyebrow size="sm">_Small/</Eyebrow>
      <Eyebrow size="md">_Medium/</Eyebrow>
      <Eyebrow size="lg">_Large/</Eyebrow>
    </div>
  );
}
