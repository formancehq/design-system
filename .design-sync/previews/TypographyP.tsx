import {
  TypographyInlineCode,
  TypographyLead,
  TypographyP,
  TypographySmall,
} from '@formance/design-system';

export function Paragraph() {
  return (
    <div className="w-full max-w-md">
      <TypographyP>
        Each ledger maintains an immutable log of all transactions posted
        against it. Accounts are created on the fly and balances are computed in
        real time from the transaction history.
      </TypographyP>
    </div>
  );
}

export function WithLeadAndCode() {
  return (
    <div className="w-full max-w-md space-y-4">
      <TypographyLead>
        Numscript describes how money moves, not how balances change.
      </TypographyLead>
      <TypographyP>
        Post a transaction with{' '}
        <TypographyInlineCode>
          POST /v2/{'{ledger}'}/transactions
        </TypographyInlineCode>{' '}
        and the ledger derives every balance from the log.
      </TypographyP>
      <TypographySmall>Applies to Ledger v2 and later.</TypographySmall>
    </div>
  );
}
