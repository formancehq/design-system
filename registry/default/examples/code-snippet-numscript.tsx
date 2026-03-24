'use client';

import { CodeSnippet } from '@/registry/default/ui/code-snippet';

const numscriptCode = `send [USD/2 10000] (
  source = @orders:1234
  destination = {
    15% to {
      20% to @platform:commission:sales_tax
      remaining to @platform:commission:revenue
    }
    10% to {
      // user gets 10% cashback up to $5 for participating merchants
      max [USD/2 500] to @users:1234:cashback
      remaining to @merchants:6789
    }
    remaining to @merchants:6789
  }
)`;

export default function CodeSnippetNumscript() {
  return (
    <CodeSnippet code={numscriptCode} language="numscript" showLineNumbers />
  );
}
