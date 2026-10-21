import { CircleCheckIcon } from 'lucide-react';

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

export default function ReasoningDuration() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <CircleCheckIcon />
            </TraceIcon>
            <TraceTitle>Thought</TraceTitle>
            <TraceDescription>12s</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="whitespace-pre-wrap">
          The withdrawal debits clients:$id:available. A client with a pending
          deposit has no available balance yet, and the script does not allow an
          overdraft.
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
