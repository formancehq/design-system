import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const patch = ` send [USD/2 $amount] (
-  source = @clients:$client:available
+  source = @clients:$client:available allowing overdraft up to [USD/2 5000]
   destination = @bank:omnibus:payouts
 )`;

function getVariant(line: string) {
  if (line.startsWith('+')) {
    return 'added';
  }

  if (line.startsWith('-')) {
    return 'removed';
  }

  return 'default';
}

export default function CodeBlockDiff() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>transactions/payout.num</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={patch} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>
          {patch.split('\n').map((line, index) => (
            <CodeBlockLine key={index} variant={getVariant(line)}>
              {line.slice(1)}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
