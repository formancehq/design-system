'use client';

import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

const sampleCode = `import { CodeSnippet } from '@/components/ui/code-snippet';

export function Example() {
  return (
    <CodeSnippet
      code="console.log('hello')"
      language="typescript"
    />
  );
}`;

export default function CodeSnippetDemo() {
  return <CodeSnippet code={sampleCode} language="typescript" />;
}
