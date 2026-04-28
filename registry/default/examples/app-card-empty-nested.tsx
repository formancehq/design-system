import { Server } from 'lucide-react';

import { AppCard } from '@/registry/default/fragments/app-card';
import { AppCardEmpty } from '@/registry/default/fragments/app-card-empty';
import { Button } from '@/registry/default/ui/button';

export default function AppCardEmptyNestedExample() {
  return (
    <div className="w-full max-w-2xl">
      <AppCard title="Ledgers" appIcon={Server} iconVariant="cobalt">
        <AppCardEmpty
          title="No ledgers found"
          description="Create a new ledger to get started."
        >
          <Button size="sm">Create ledger</Button>
        </AppCardEmpty>
      </AppCard>
    </div>
  );
}
