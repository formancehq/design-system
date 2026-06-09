import { Wallet } from 'lucide-react';

import { AppCard } from '@/components/ui-fragments/app-card';
import { Button } from '@/registry/default/ui/button';
import { TypographyP } from '@/registry/default/ui/typography';

export default function AppCardDemo() {
  return (
    <div className="w-full max-w-2xl">
      <AppCard
        title="Wallets"
        description="Manage user balances with first-class accounting."
        appIcon={Wallet}
        iconVariant="emerald"
        headerAction={<Button size="sm">Configure</Button>}
      >
        <TypographyP>
          Hold balances per user, settle internally, and reconcile against the
          ledger in real time.
        </TypographyP>
      </AppCard>
    </div>
  );
}
