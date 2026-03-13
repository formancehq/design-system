'use client';

import { ExternalLink } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export default function ButtonLink() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="link">Link</Button>
      <Button variant="link">
        <ExternalLink className="mr-2 h-4 w-4" />
        With Icon
      </Button>
      <Button variant="link" disabled>
        Disabled
      </Button>
    </div>
  );
}
