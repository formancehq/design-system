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

const VALIDATE_OUTPUT = `Validating schema.yaml

accounts.fees
  error  Account has no outgoing transaction

transactions.accrue_interest
  error  Posts from @world without a cap

✖ 2 problems (2 errors, 0 warnings)

Error: schema validation failed with exit code 1.`;

export default function TerminalError() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Ran fctl login</TraceTitle>
      </TraceLine>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>
              fctl ledger schema validate exited with code 1
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {VALIDATE_OUTPUT}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
