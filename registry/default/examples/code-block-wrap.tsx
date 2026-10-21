import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';

const output = `Error: INSUFFICIENT_FUND: account "clients:8812:available" has 12000 USD/2, the transaction needs 25000 USD/2. Add funds to the account, lower the amount, or allow an overdraft on the source in the Numscript.`;

export default function CodeBlockWrap() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CodeBlock>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
      <CodeBlock>
        <CodeBlockContent wrap>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
