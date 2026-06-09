import { Server } from 'lucide-react';

import { AppCard } from '@/components/ui-fragments/app-card';
import { AppCardEmpty } from '@/components/ui-fragments/app-card-empty';
import { Button } from '@/registry/default/ui/button';

export default function AppCardWithEmptyExample() {
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
