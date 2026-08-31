import { Button } from '@formance/design-system';
import { Mail } from 'lucide-react';

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}

export function BrandColors() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="emerald">Emerald</Button>
      <Button variant="lilac">Lilac</Button>
      <Button variant="gold">Gold</Button>
      <Button variant="cobalt">Cobalt</Button>
      <Button variant="mint">Mint</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">
        <Mail className="mr-2 h-4 w-4" />
        Login with Email
      </Button>
      <Button variant="primary" loading>
        Creating ledger
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  );
}
