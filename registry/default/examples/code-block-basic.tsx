import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';

const output = `$ fctl ledger transactions list --ledger omnibus
ID  REFERENCE        POSTINGS  TIMESTAMP
42  payout-8812      2         2026-10-21T09:12:04Z
41  deposit-8811     1         2026-10-21T09:10:51Z
40  fee-accrual-77   3         2026-10-21T00:00:00Z
39  deposit-8810     1         2026-10-20T17:44:19Z`;

export default function CodeBlockBasic() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
