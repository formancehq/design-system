'use client';

import { TerminalIcon } from 'lucide-react';

import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const code = `brew install formancehq/tap/fctl
fctl login`;

export default function CodeBlockRtl() {
  const lines = useHighlightedCode(code, 'bash');

  return (
    <div className="flex w-full max-w-md flex-col gap-3 text-sm" dir="rtl">
      <p>ثبّت fctl، ثم سجّل الدخول إلى Formance Cloud.</p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            الطرفية
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
