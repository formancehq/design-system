'use client';

import { Button } from '@/registry/default/ui/button';

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="emerald">Emerald</Button>
      <Button variant="lilac">Lilac</Button>
      <Button variant="cobalt">Cobalt</Button>
      <Button variant="gold">Gold</Button>
      <Button variant="mint">Mint</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="primary" loading>
        Loading
      </Button>
    </div>
  );
}
