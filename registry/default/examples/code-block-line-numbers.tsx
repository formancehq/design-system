import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';

const code = `{
  "ledger": "omnibus",
  "postings": [
    {
      "source": "clients:8812:available",
      "destination": "bank:omnibus:payouts",
      "amount": 25000,
      "asset": "USD/2"
    }
  ]
}`;

export default function CodeBlockLineNumbers() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent lineNumbers>{code}</CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
