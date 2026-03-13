'use client';

import { Button } from '@/registry/default/ui/button';

export default function ButtonLoading() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Primary</Button>
      <Button variant="secondary" loading>
        Secondary
      </Button>
      <Button variant="outline" loading>
        Outline
      </Button>
    </div>
  );
}
