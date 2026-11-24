'use client';

import { useState } from 'react';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/registry/default/ui/item';

const movements = [
  { name: 'deposit', description: 'Fund a user wallet' },
  { name: 'withdrawal', description: 'Send funds to a bank account' },
  { name: 'transfer', description: 'Move funds between two wallets' },
  { name: 'refund', description: 'Return a payment to the payer' },
];

export default function ItemSelectableExample() {
  const [selected, setSelected] = useState('withdrawal');

  return (
    <nav aria-label="Money movements" className="w-full max-w-xs">
      <ItemGroup className="gap-1">
        {movements.map((movement) => (
          <Item key={movement.name} asChild size="sm">
            <button
              type="button"
              aria-current={selected === movement.name ? 'true' : undefined}
              onClick={() => setSelected(movement.name)}
            >
              <ItemContent>
                <ItemTitle>{movement.name}</ItemTitle>
                <ItemDescription>{movement.description}</ItemDescription>
              </ItemContent>
            </button>
          </Item>
        ))}
      </ItemGroup>
    </nav>
  );
}
