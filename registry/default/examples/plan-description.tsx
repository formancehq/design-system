import { CircleCheckIcon, CircleIcon, RouteIcon } from 'lucide-react';

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

const steps = [
  'Split bank:omnibus into one account per bank',
  'Route each deposit to the bank of its currency',
  'Update the withdrawal source',
  'Run the validation checks',
];

export default function PlanDescription() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <RouteIcon />
            </TraceIcon>
            <TraceTitle>Plan: hold funds across two banks</TraceTitle>
            <TraceDescription>1 of {steps.length} done</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="flex flex-col gap-3">
          <p>
            Keep one sub-balance per client, so each bank total always equals
            the sum of its client balances.
          </p>
          <Trace>
            {steps.map((step, index) => (
              <TraceLine key={step} status={index > 0 ? 'pending' : undefined}>
                <TraceIcon>
                  {index === 0 ? <CircleCheckIcon /> : <CircleIcon />}
                </TraceIcon>
                <TraceTitle>{step}</TraceTitle>
              </TraceLine>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
