import { StatusDot } from '@/registry/default/ui/status-dot';

export default function StatusDotLabel() {
  return (
    <div className="flex flex-col gap-6">
      <StatusDot variant="valid">Active</StatusDot>
      <StatusDot variant="destructive">Failed</StatusDot>
      <StatusDot variant="info">Processing</StatusDot>
      <StatusDot variant="warning">Pending</StatusDot>
      <StatusDot variant="zinc">Inactive</StatusDot>
      <StatusDot variant="outline">Unknown</StatusDot>
    </div>
  );
}
