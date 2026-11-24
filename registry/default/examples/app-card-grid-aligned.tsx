import { ArrowLeftRight, BookOpen, Wallet } from 'lucide-react';

import { AppCard } from '@/components/ui-fragments/app-card';
import { Button } from '@/registry/default/ui/button';

const apps = [
  {
    title: 'Ledger',
    description: 'Record every transaction.',
    icon: BookOpen,
  },
  {
    title: 'Wallets',
    description:
      'Hold balances per user. The ledger settles each balance internally, and you can add holds before you confirm a payment.',
    icon: Wallet,
  },
  {
    title: 'Payments',
    description: 'Connect your payment providers and move funds between them.',
    icon: ArrowLeftRight,
  },
];

export default function AppCardGridAlignedExample() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
      {apps.map((app) => (
        <AppCard
          key={app.title}
          title={app.title}
          description={app.description}
          appIcon={app.icon}
          iconVariant="secondary"
          contentAlign="end"
        >
          <Button size="sm" variant="primary">
            Open
          </Button>
        </AppCard>
      ))}
    </div>
  );
}
