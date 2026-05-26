'use client';

import { BadgeStatus } from '@/registry/default/ui/badge-status';

export default function BadgeStatusSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <BadgeStatus size="sm" variant="valid">
        Small
      </BadgeStatus>
      <BadgeStatus size="md" variant="valid">
        Medium
      </BadgeStatus>
      <BadgeStatus size="lg" variant="valid">
        Large
      </BadgeStatus>
    </div>
  );
}
