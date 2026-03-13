'use client';

import { Badge } from '@/registry/default/ui/badge';

export default function BadgeBrandColors() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="emerald">Emerald</Badge>
      <Badge variant="lilac">Lilac</Badge>
      <Badge variant="gold">Gold</Badge>
      <Badge variant="cobalt">Cobalt</Badge>
      <Badge variant="mint">Mint</Badge>
    </div>
  );
}
