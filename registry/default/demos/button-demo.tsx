'use client';

import { Button } from '@/registry/default/ui/button';

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary" size="md">Primary</Button>
      <Button variant="outline" size="md">Outline</Button>
      <Button variant="ghost" size="md">Ghost</Button>
      <Button variant="emerald" size="md">Emerald</Button>
      <Button variant="lilac" size="md">Lilac</Button>
      <Button variant="cobalt" size="md">Cobalt</Button>
      <Button variant="gold" size="md">Gold</Button>
      <Button variant="mint" size="md">Mint</Button>
      <Button variant="destructive" size="md">Destructive</Button>
      <Button variant="primary" size="md" loading>Loading</Button>
    </div>
  );
}
