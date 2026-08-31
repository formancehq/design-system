import { TypographyInlineCode, TypographyP } from '@formance/design-system';

export function InProse() {
  return (
    <div className="w-full max-w-md">
      <TypographyP>
        Post a transaction with{' '}
        <TypographyInlineCode>
          POST /v2/{'{ledger}'}/transactions
        </TypographyInlineCode>{' '}
        and read it back with{' '}
        <TypographyInlineCode>GET /v2/{'{ledger}'}/logs</TypographyInlineCode>.
      </TypographyP>
    </div>
  );
}

export function Standalone() {
  return <TypographyInlineCode>fctl stack create</TypographyInlineCode>;
}
