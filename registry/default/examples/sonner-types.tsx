'use client';

import { toast } from 'sonner';

import { Button } from '@/registry/default/ui/button';

export default function SonnerTypesExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Payment processed', {
            description: 'Transaction #4829 completed successfully.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Transfer failed', {
            description: 'Insufficient funds in wallet.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Low balance', {
            description: 'Account balance is below the configured threshold.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info('Connector syncing', {
            description: 'Stripe connector is synchronizing transactions.',
          })
        }
      >
        Info
      </Button>
    </div>
  );
}
