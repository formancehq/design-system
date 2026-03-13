'use client';

import { toast } from 'sonner';

import { Button } from '@/registry/default/ui/button';

export default function SonnerDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast('Transaction recorded')}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success('Payment processed')}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error('Transfer failed')}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning('Low balance')}>
        Warning
      </Button>
    </div>
  );
}
