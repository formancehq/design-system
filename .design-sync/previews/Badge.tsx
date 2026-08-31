import { Badge } from '@formance/design-system';

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}

export function StatusMeanings() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="valid">Active</Badge>
      <Badge variant="info">Provisioning</Badge>
      <Badge variant="warning">Degraded</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  );
}

export function BrandColors() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="emerald">Ledger</Badge>
      <Badge variant="lilac">Payments</Badge>
      <Badge variant="gold">Wallets</Badge>
      <Badge variant="cobalt">Webhooks</Badge>
      <Badge variant="mint">Flows</Badge>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  );
}
