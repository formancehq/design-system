import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  FileTextIcon,
  GlobeIcon,
} from 'lucide-react';

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

export default function TraceLink() {
  return (
    <Trace className="max-w-sm">
      <a href="#link">
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
      <a
        href="https://docs.formance.com/modules/ledger/introduction"
        target="_blank"
        rel="noreferrer"
      >
        <TraceLine>
          <TraceIcon>
            <GlobeIcon />
          </TraceIcon>
          <TraceTitle>
            Ledger | docs.formance.com
            <span className="sr-only"> (opens in a new tab)</span>
          </TraceTitle>
          <TraceIcon>
            <ArrowUpRightIcon />
          </TraceIcon>
        </TraceLine>
      </a>
    </Trace>
  );
}
