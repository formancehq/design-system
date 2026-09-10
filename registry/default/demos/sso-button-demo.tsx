'use client';

import { useState } from 'react';

import {
  SsoButtonGroup,
  type TSsoProvider,
} from '@/components/ui-fragments/sso-button';

export default function SsoButtonDemo() {
  const [selected, setSelected] = useState<TSsoProvider | null>(null);

  return (
    <div className="w-full max-w-sm space-y-4">
      <SsoButtonGroup onProviderSelect={setSelected} />
      <p className="text-muted-foreground text-center text-xs">
        {selected ? `Redirecting to ${selected}…` : 'Pick a provider'}
      </p>
    </div>
  );
}
