'use client';

import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const code = `{
  "address": "clients:8812:available",
  "balances": { "USD/2": 125000 },
  "metadata": { "type": "liability", "client": "8812" }
}`;

export default function CodeBlockHighlighting() {
  const lines = useHighlightedCode(code, 'json');

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>getAccount output</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
