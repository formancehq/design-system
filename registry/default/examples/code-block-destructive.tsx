import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const error = `NUMSCRIPT_ERROR: line 3: unknown variable $amout
  send [USD/2 $amout] (
              ^^^^^^
did you mean $amount?`;

export default function CodeBlockDestructive() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock variant="destructive">
        <CodeBlockHeader>
          <CodeBlockTitle>Error</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={error} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap>{error}</CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
