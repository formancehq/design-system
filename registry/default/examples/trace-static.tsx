import { GitBranchIcon } from 'lucide-react';

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

export default function TraceStatic() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <GitBranchIcon />
        </TraceIcon>
        <TraceTitle>Created branch schema/interest-accrual</TraceTitle>
      </TraceLine>
    </Trace>
  );
}
