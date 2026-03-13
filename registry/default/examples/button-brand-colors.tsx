'use client';

import { Button } from '@/registry/default/ui/button';

export default function ButtonBrandColors() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="emerald">Emerald</Button>
      <Button variant="lilac">Lilac</Button>
      <Button variant="gold">Gold</Button>
      <Button variant="cobalt">Cobalt</Button>
      <Button variant="mint">Mint</Button>
    </div>
  );
}
