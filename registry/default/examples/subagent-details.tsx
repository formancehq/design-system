import { CircleCheckIcon } from 'lucide-react';

import { Badge } from '@/registry/default/ui/badge';
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

export default function SubagentDetails() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
            </TraceIcon>
            <TraceTitle>Ran the research agent</TraceTitle>
            <TraceDescription>48s</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">anthropic/claude-sonnet-4.5</Badge>
            <Badge variant="outline" className="font-mono">
              runCommand
            </Badge>
          </div>
          <p>Find out why the deposit fails on the sandbox ledger.</p>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>
                Ran grep -n source schema/transactions/deposit.num
              </TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>
                Ran fctl ledger accounts show bank:omnibus
              </TraceTitle>
            </TraceLine>
          </Trace>
          <p>The deposit sends from @bank:omnibus, which is empty.</p>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
