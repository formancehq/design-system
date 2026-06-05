import { BadgeMethod } from '@/registry/default/ui/badge-method';

export default function BadgeMethodDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <BadgeMethod method="GET" />
      <BadgeMethod method="POST" />
      <BadgeMethod method="PUT" />
      <BadgeMethod method="PATCH" />
      <BadgeMethod method="DELETE" />
      <BadgeMethod method="HEAD" />
      <BadgeMethod method="OPTIONS" />
    </div>
  );
}
