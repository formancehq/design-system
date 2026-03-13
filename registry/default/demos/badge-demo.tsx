'use client';

import { Badge } from '@/registry/default/ui/badge';

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="emerald">Emerald</Badge>
      <Badge variant="lilac">Lilac</Badge>
      <Badge variant="gold">Gold</Badge>
      <Badge variant="cobalt">Cobalt</Badge>
      <Badge variant="mint">Mint</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="valid">Valid</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  );
}
