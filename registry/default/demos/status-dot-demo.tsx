import { StatusDot } from '@/registry/default/ui/status-dot';

export default function StatusDotDemo() {
  return (
    <div className="flex flex-col gap-6">
      <StatusDot variant="valid" role="img" aria-label="Active" />
      <StatusDot variant="destructive" role="img" aria-label="Failed" />
      <StatusDot variant="info" role="img" aria-label="Processing" />
      <StatusDot variant="warning" role="img" aria-label="Pending" />
      <StatusDot variant="zinc" role="img" aria-label="Inactive" />
      <StatusDot variant="outline" role="img" aria-label="Unknown" />
    </div>
  );
}
