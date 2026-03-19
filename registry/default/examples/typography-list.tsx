'use client';

import { TypographyList, TypographyListItem } from '@/registry/default/ui/typography';

export default function TypographyListExample() {
  return (
    <TypographyList>
      <TypographyListItem>Ledgers track double-entry transactions</TypographyListItem>
      <TypographyListItem>Payments connect to external providers</TypographyListItem>
      <TypographyListItem>Wallets hold funds for end users</TypographyListItem>
      <TypographyListItem>Connectors sync with third-party systems</TypographyListItem>
    </TypographyList>
  );
}
