'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowWithoutSquare() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow withSquare={false} variant="primary">_Primary/</Eyebrow>
      <Eyebrow withSquare={false} variant="secondary">_Secondary/</Eyebrow>
      <Eyebrow withSquare={false} variant="gold">_Gold/</Eyebrow>
    </div>
  );
}
