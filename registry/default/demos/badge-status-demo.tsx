import { BadgeStatus } from '@/registry/default/ui/badge-status';

export default function BadgeStatusDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <BadgeStatus variant="valid">Active</BadgeStatus>
      <BadgeStatus variant="destructive">Failed</BadgeStatus>
      <BadgeStatus variant="info">Processing</BadgeStatus>
      <BadgeStatus variant="warning">Pending</BadgeStatus>
      <BadgeStatus variant="zinc">Inactive</BadgeStatus>
      <BadgeStatus variant="outline">Unknown</BadgeStatus>
    </div>
  );
}
