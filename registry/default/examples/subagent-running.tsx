import { CircleCheckIcon, LoaderCircleIcon } from 'lucide-react';

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

export default function SubagentRunning() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceIcon>
              <LoaderCircleIcon className="animate-spin" />
            </TraceIcon>
            <TraceTitle>Running the research agent</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <CircleCheckIcon />
              </TraceIcon>
              <TraceTitle>
                Ran grep -n source schema/transactions/deposit.num
              </TraceTitle>
            </TraceLine>
            <TraceLine status="running">
              <TraceIcon>
                <LoaderCircleIcon className="animate-spin" />
              </TraceIcon>
              <TraceTitle>
                Running fctl ledger accounts show bank:omnibus
              </TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
