'use client';

import { BadgeEyebrow } from '@/registry/default/ui/badge-eyebrow';

export default function BadgeEyebrowColors() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <BadgeEyebrow variant="emerald">Emerald</BadgeEyebrow>
      <BadgeEyebrow variant="lilac">Lilac</BadgeEyebrow>
      <BadgeEyebrow variant="gold">Gold</BadgeEyebrow>
      <BadgeEyebrow variant="mint">Mint</BadgeEyebrow>
      <BadgeEyebrow variant="cobalt">Cobalt</BadgeEyebrow>
    </div>
  );
}
