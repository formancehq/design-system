import { Wallet } from 'lucide-react';

import { AppCardEmpty } from '@/components/ui-fragments/app-card-empty';
import { Button } from '@/registry/default/ui/button';

export default function AppCardEmptyWithActionsExample() {
  return (
    <div className="w-full max-w-2xl">
      <AppCardEmpty
        title="No wallets created"
        description="Create a wallet to start tracking user balances against the ledger."
        appIcon={Wallet}
      >
        <Button size="sm">Create wallet</Button>
        <Button size="sm" variant="outline">
          View docs
        </Button>
      </AppCardEmpty>
    </div>
  );
}
