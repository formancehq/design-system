'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowSlash() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow variant="primary">Getting Started/</Eyebrow>
      <Eyebrow variant="secondary">Documentation/</Eyebrow>
      <Eyebrow variant="gold">New Feature/</Eyebrow>
    </div>
  );
}
