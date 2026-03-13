import { BadgeEyebrow } from '@/registry/default/ui/badge-eyebrow';

export default function BadgeEyebrowDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <BadgeEyebrow variant="emerald">Emerald</BadgeEyebrow>
      <BadgeEyebrow variant="lilac">Lilac</BadgeEyebrow>
      <BadgeEyebrow variant="gold">Gold</BadgeEyebrow>
      <BadgeEyebrow variant="cobalt">Cobalt</BadgeEyebrow>
      <BadgeEyebrow variant="secondary">Secondary</BadgeEyebrow>
      <BadgeEyebrow variant="destructive">Destructive</BadgeEyebrow>
      <BadgeEyebrow variant="outline">Outline</BadgeEyebrow>
    </div>
  );
}
