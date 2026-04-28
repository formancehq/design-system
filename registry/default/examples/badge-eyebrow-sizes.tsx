'use client';

import { BadgeEyebrow } from '@/registry/default/ui/badge-eyebrow';

export default function BadgeEyebrowSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <BadgeEyebrow>With prefix and suffix</BadgeEyebrow>
      <BadgeEyebrow showSuffix={false}>Prefix only</BadgeEyebrow>
      <BadgeEyebrow showPrefix={false}>Suffix only</BadgeEyebrow>
      <BadgeEyebrow showPrefix={false} showSuffix={false}>
        No decorators
      </BadgeEyebrow>
    </div>
  );
}
