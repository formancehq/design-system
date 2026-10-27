import { BrainIcon, FileTextIcon, SearchIcon } from 'lucide-react';

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

export default function TraceDescriptionBlockDemo() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <SearchIcon />
            </TraceIcon>
            <TraceTitle>Read 2 sources</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <TraceLine>
            <TraceIcon>
              <BrainIcon />
            </TraceIcon>
            <TraceTitle>Reasoning</TraceTitle>
            <TraceDescription variant="block">
              The withdrawal debits clients:$id:available. I must read the
              schema first, then the last transactions of the account, to see
              why the balance is not sufficient.
            </TraceDescription>
          </TraceLine>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <FileTextIcon />
              </TraceIcon>
              <TraceTitle>Read schema/transactions/withdrawal.num</TraceTitle>
            </TraceLine>
            <TraceLine>
              <TraceIcon>
                <FileTextIcon />
              </TraceIcon>
              <TraceTitle>Listed the transactions of clients:42</TraceTitle>
              <TraceDescription>12 results</TraceDescription>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
