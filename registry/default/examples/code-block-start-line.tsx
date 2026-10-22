'use client';

import { useHighlightedCode } from '@/registry/default/hooks/use-highlighted-code';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const code = `	if err := store.Commit(ctx, tx); err != nil {
		return nil, fmt.Errorf("committing transaction: %w", err)
	}

	logs, err := store.InsertLogs(ctx, ledger.NewTransactionLog(tx))
	if err != nil {
		return nil, err
	}

	return tx, nil
}`;

export default function CodeBlockStartLine() {
  const lines = useHighlightedCode(code, 'go');

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            internal/controller/ledger/controller.go
          </CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers startLine={995}>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
