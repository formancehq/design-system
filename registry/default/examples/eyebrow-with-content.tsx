'use client';

import { Eyebrow } from '@/registry/default/ui/eyebrow';

export default function EyebrowWithContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Eyebrow variant="gold" size="sm" withSquare={false}>_New Feature/</Eyebrow>
        <h3 className="text-2xl font-semibold tracking-tight">Programmable Ledger</h3>
        <p className="text-muted-foreground">Build financial products with a ledger designed for developers.</p>
      </div>
      <div className="space-y-2">
        <Eyebrow variant="primary" size="sm" withSquare={false}>_Blog Post/</Eyebrow>
        <h3 className="text-2xl font-semibold tracking-tight">Why We Built Formance</h3>
        <p className="text-muted-foreground">The story behind our open-source financial infrastructure.</p>
      </div>
    </div>
  );
}
