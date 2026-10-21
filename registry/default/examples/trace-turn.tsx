import {
  BrainIcon,
  ChevronRightIcon,
  FileTextIcon,
  TerminalIcon,
} from 'lucide-react';

import { CodeBlock, CodeBlockContent } from '@/registry/default/ui/code-block';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

export default function TraceTurn() {
  return (
    <div className="w-full max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceTitle>Worked for 2m 4s, 1 command failed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="flex flex-col gap-2">
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <BrainIcon />
                  </TraceIcon>
                  <TraceTitle>Thought</TraceTitle>
                  <TraceDescription>12s</TraceDescription>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="whitespace-pre-wrap">
                I should check which modules the stack has before I deploy the
                schema.
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger>
                <TraceLine status="error">
                  <TraceIcon>
                    <TerminalIcon />
                  </TraceIcon>
                  <TraceTitle>Ran 2 commands, 1 failed</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  <TraceLine>
                    <TraceIcon>
                      <TerminalIcon />
                    </TraceIcon>
                    <TraceTitle>Ran fctl ledger list</TraceTitle>
                  </TraceLine>
                  <TraceCollapsible>
                    <TraceCollapsibleTrigger>
                      <TraceLine status="error">
                        <TraceIcon>
                          <TerminalIcon />
                        </TraceIcon>
                        <TraceTitle>
                          Failed to run fctl payments connectors list
                        </TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm" variant="destructive">
                        <CodeBlockContent wrap className="max-h-64">
                          payments is not enabled on this stack
                        </CodeBlockContent>
                      </CodeBlock>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p>The ledger is enabled and payments is not. Reading the schema.</p>
          <Trace>
            <a href="#turn">
              <TraceLine>
                <TraceIcon>
                  <FileTextIcon />
                </TraceIcon>
                <TraceTitle>Read schema/accounts.yaml</TraceTitle>
                <TraceIcon>
                  <ChevronRightIcon />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </div>
  );
}
