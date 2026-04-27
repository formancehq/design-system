import { CircleAlert, Wallet } from 'lucide-react';

import { AppCard } from '@/registry/default/fragments/app-card';
import { Button } from '@/registry/default/ui/button';
import { CardFooter } from '@/registry/default/ui/card';
import { TypographyP } from '@/registry/default/ui/typography';

export default function AppCardWithFooterExample() {
  return (
    <div className="w-full max-w-2xl">
      <AppCard
        title="Wallets"
        description="Hold balances per user, settled internally against the ledger."
        appIcon={Wallet}
        iconVariant="emerald"
        footer={
          <CardFooter variant="isInformative">
            <span className="flex items-center gap-2 text-sm">
              <CircleAlert className="size-4" />
              Pending balances are reconciled every 5 minutes.
            </span>
            <Button size="sm" variant="primary">
              View settings
            </Button>
          </CardFooter>
        }
      >
        <TypographyP>
          12 active wallets · 3 pending reconciliations.
        </TypographyP>
      </AppCard>
    </div>
  );
}
