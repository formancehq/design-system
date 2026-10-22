import { TerminalIcon } from 'lucide-react';

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from '@/registry/default/ui/code-block';

const command = 'fctl stack create sandbox --region eu-west-1';

const output = `$ ${command}
Creating stack "sandbox"...
Stack created: sandbox-k3x9 (eu-west-1)
Modules: ledger, payments, wallets
Done in 41.2s`;

export default function CodeBlockHeaderExample() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <TerminalIcon />
            Terminal
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={command} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{output}</CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
