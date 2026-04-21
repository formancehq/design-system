'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowVariants() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow variant="primary">_Primary/</Eyebrow>
      <Eyebrow variant="secondary">_Secondary/</Eyebrow>
      <Eyebrow variant="gold">_Gold/</Eyebrow>
    </div>
  );
}
