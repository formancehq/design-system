import { Inbox } from 'lucide-react';

import { AppCardEmpty } from '@/components/ui-fragments/app-card-empty';
import { Button } from '@/registry/default/ui/button';

export default function AppCardEmptyDemo() {
  return (
    <div className="w-full max-w-2xl">
      <AppCardEmpty
        title="No transactions yet"
        description="Once you start posting to this ledger, transactions will appear here."
        appIcon={Inbox}
      >
        <Button size="sm">Create transaction</Button>
        <Button size="sm" variant="outline">
          Read docs
        </Button>
      </AppCardEmpty>
    </div>
  );
}
