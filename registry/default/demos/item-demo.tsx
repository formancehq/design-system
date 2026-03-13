import { WalletIcon } from 'lucide-react';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/registry/default/ui/item';

export default function ItemDemo() {
  return (
    <ItemGroup className="w-full max-w-md">
      <Item>
        <ItemMedia variant="icon">
          <WalletIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Main Wallet</ItemTitle>
          <ItemDescription>Primary wallet for transactions</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon">
          <WalletIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Savings Wallet</ItemTitle>
          <ItemDescription>Long-term savings account</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}
