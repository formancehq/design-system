import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
} from '@/registry/default/ui/code-block';

const output = `$ npm install @formance/formance-sdk
added 14 packages, and audited 415 packages in 3s
dependencies:
+ @formance/formance-sdk 4.3.0
found 0 vulnerabilities`;

export default function CodeBlockFloatingActions() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockActions>
          <CodeBlockCopyButton value={output} />
        </CodeBlockActions>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
