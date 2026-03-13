'use client';

import { useState } from 'react';

import { NavTab, NavTabs } from '@/registry/default/ui/nav-tabs';

export default function NavTabsDemo() {
  const [active, setActive] = useState('ledgers');

  return (
    <NavTabs>
      <NavTab
        variant={active === 'ledgers' ? 'active' : 'default'}
        onClick={() => setActive('ledgers')}
      >
        Ledgers
      </NavTab>
      <NavTab
        variant={active === 'payments' ? 'active' : 'default'}
        onClick={() => setActive('payments')}
      >
        Payments
      </NavTab>
      <NavTab
        variant={active === 'wallets' ? 'active' : 'default'}
        onClick={() => setActive('wallets')}
      >
        Wallets
      </NavTab>
    </NavTabs>
  );
}
