'use client';

import { Badge } from '@/registry/default/ui/badge';

export default function BadgeStates() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="valid">Valid</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  );
}
