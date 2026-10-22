import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from '@/registry/default/ui/code-block';

const code = `accounts:
  bank:omnibus:
    metadata: { type: asset }
  clients:$id:available:
    metadata: { type: liability }
  fees:interest:
    metadata: { type: revenue }`;

const highlighted = [3, 4];

export default function CodeBlockHighlightedLines() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockContent lineNumbers>
          {code.split('\n').map((line, index) => (
            <CodeBlockLine
              key={index}
              variant={highlighted.includes(index) ? 'highlighted' : 'default'}
            >
              {line}
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
