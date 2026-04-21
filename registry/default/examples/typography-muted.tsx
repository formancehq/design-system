'use client';

import { TypographyP } from '@/registry/default/ui/typography';

export default function TypographyMutedExample() {
  return (
    <TypographyP className="text-sm text-muted-foreground">
      No pending transactions found for this account.
    </TypographyP>
  );
}
