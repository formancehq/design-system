'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowUnderscore() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Eyebrow variant="primary" withSquare={false}>_Getting Started</Eyebrow>
      <Eyebrow variant="secondary" withSquare={false}>_Documentation</Eyebrow>
      <Eyebrow variant="gold" withSquare={false}>_New Feature</Eyebrow>
    </div>
  );
}
