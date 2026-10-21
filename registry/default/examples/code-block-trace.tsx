import { TerminalIcon } from 'lucide-react';

import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

const output = `$ fctl version
fctl v3.4.1 (stack v2.3.0)`;

const error = `$ fctl ledger send world clients:8812:available 100 USD/2 --ledger omnibus
Error: ledger "omnibus" not found on stack sandbox-k3x9
    run "fctl ledger create omnibus" first`;

export default function CodeBlockTrace() {
  return (
    <div className="w-full max-w-md">
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <TerminalIcon />
              </TraceIcon>
              <TraceTitle>Ran fctl version</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {output}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <TerminalIcon />
              </TraceIcon>
              <TraceTitle>Failed to run fctl ledger send</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm" variant="destructive">
              <CodeBlockContent wrap className="max-h-64">
                {error}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  );
}
