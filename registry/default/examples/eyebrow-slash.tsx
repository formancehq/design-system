'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowSlash() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow variant="primary" withSquare={false}>Getting Started/</Eyebrow>
      <Eyebrow variant="secondary" withSquare={false}>Documentation/</Eyebrow>
      <Eyebrow variant="gold" withSquare={false}>New Feature/</Eyebrow>
    </div>
  );
}
