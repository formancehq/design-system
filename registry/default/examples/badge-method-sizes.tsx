'use client';

import { BadgeMethod } from '@/registry/default/ui/badge-method';

export default function BadgeMethodSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <BadgeMethod size="sm" method="POST" />
      <BadgeMethod size="md" method="POST" />
      <BadgeMethod size="lg" method="POST" />
    </div>
  );
}
