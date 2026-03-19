'use client';

import { TypographyInlineCode } from '@/registry/default/ui/typography';

export default function TypographyInlineCodeExample() {
  return (
    <p className="text-sm">
      Use the <TypographyInlineCode>POST /api/ledger/v2/transactions</TypographyInlineCode> endpoint
      to create a new transaction.
    </p>
  );
}
