'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow variant="primary">_Getting Started/</Eyebrow>
      <Eyebrow variant="secondary">_Documentation/</Eyebrow>
      <Eyebrow variant="gold">_New Feature/</Eyebrow>
    </div>
  );
}
