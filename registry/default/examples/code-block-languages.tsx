'use client';

import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const samples = [
  {
    language: 'numscript',
    title: 'transactions/deposit.num',
    code: `send [USD/2 $amount] (
  source = @world
  destination = @clients:$client:available
)`,
  },
  {
    language: 'go',
    title: 'main.go',
    code: `func main() {
	fmt.Println("ledger ready")
}`,
  },
  {
    language: 'text',
    title: 'notes.txt',
    code: 'A language that is not in the list renders as plain text.',
  },
];

function Sample({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language);

  return (
    <CodeBlockContent>
      {lines.map((line, index) => (
        <CodeBlockLine key={index}>{line}</CodeBlockLine>
      ))}
    </CodeBlockContent>
  );
}

export default function CodeBlockLanguages() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {samples.map((sample) => (
        <CodeBlock key={sample.language}>
          <CodeBlockHeader>
            <CodeBlockTitle>{sample.title}</CodeBlockTitle>
          </CodeBlockHeader>
          <Sample code={sample.code} language={sample.language} />
        </CodeBlock>
      ))}
    </div>
  );
}
