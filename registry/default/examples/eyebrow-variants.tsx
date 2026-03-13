'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowVariants() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow variant="primary" withSquare={false}>_Primary/</Eyebrow>
      <Eyebrow variant="secondary" withSquare={false}>_Secondary/</Eyebrow>
      <Eyebrow variant="gold" withSquare={false}>_Gold/</Eyebrow>
    </div>
  );
}
