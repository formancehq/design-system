import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleIcon,
  LoaderCircleIcon,
} from 'lucide-react';

import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

export default function TraceStatus() {
  return (
    <Trace className="max-w-sm">
      <TraceLine>
        <TraceIcon>
          <CircleCheckIcon />
        </TraceIcon>
        <TraceTitle>Validated the schema</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceIcon>
          <CircleAlertIcon />
        </TraceIcon>
        <TraceTitle>Failed to deploy the schema</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>
          <LoaderCircleIcon className="animate-spin" />
        </TraceIcon>
        <TraceTitle>Running the design run</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <CircleIcon />
        </TraceIcon>
        <TraceTitle>Run the deposit test</TraceTitle>
      </TraceLine>
    </Trace>
  );
}
