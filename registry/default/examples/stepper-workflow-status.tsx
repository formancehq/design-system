'use client';

import * as React from 'react';

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  type TStepperStatus,
} from '@/registry/default/ui/stepper';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/registry/default/ui/toggle-group';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    value: 'sandbox',
    title: 'Create the Sandbox',
    description:
      'Membership provisions the Sandbox. Then Studio waits for its ledger.',
    finishedAt: '2026-11-24T10:42:00Z',
  },
  {
    value: 'ledger',
    title: 'Create the ledger',
    description: 'One new, empty ledger on the Sandbox.',
    finishedAt: '2026-11-24T10:44:00Z',
  },
  {
    value: 'schema',
    title: 'Store the schema',
    description:
      'The ledger saves the schema under the version that you chose.',
    finishedAt: '2026-11-24T10:45:00Z',
  },
  {
    value: 'verify',
    title: 'Verify',
    description:
      'Studio reads the schema back and compares it with this revision.',
    finishedAt: '2026-11-24T10:46:00Z',
  },
];

const SCENARIOS: Record<
  TStepperStatus,
  { label: string; current: string; statusLabel: string }
> = {
  running: { label: 'Running', current: 'schema', statusLabel: 'In progress' },
  failed: {
    label: 'Failed',
    current: 'schema',
    statusLabel: 'Stopped on error',
  },
  paused: {
    label: 'Paused',
    current: 'ledger',
    statusLabel: 'Waiting for approval',
  },
};

const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

export default function StepperWorkflowStatus() {
  const [status, setStatus] = React.useState<TStepperStatus>('running');
  const scenario = SCENARIOS[status];
  const currentIndex = STEPS.findIndex(
    (step) => step.value === scenario.current
  );

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        aria-label="Status of the current step"
        value={status}
        onValueChange={(value) => {
          if (value) setStatus(value as TStepperStatus);
        }}
      >
        {Object.entries(SCENARIOS).map(([value, { label }]) => (
          <ToggleGroupItem key={value} value={value}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Stepper orientation="vertical" value={scenario.current} nonInteractive>
        <StepperList className="w-full">
          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;

            return (
              <StepperItem
                key={step.value}
                value={step.value}
                status={index === currentIndex ? status : undefined}
                className="group/step w-full flex-row items-start gap-3"
              >
                <div className="flex flex-col items-center self-stretch">
                  <StepperTrigger>
                    <StepperIndicator />
                  </StepperTrigger>
                  {!isLast && (
                    <StepperSeparator className="my-1 min-h-6 flex-1" />
                  )}
                </div>
                <div
                  className={cn(
                    'flex min-w-0 flex-1 flex-col gap-0.5 pt-1',
                    !isLast && 'pb-5'
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <StepperTitle className="group-data-[state=inactive]/step:font-normal group-data-[state=inactive]/step:text-muted-foreground">
                      {step.title}
                    </StepperTitle>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {index < currentIndex ? (
                        <time dateTime={step.finishedAt}>
                          {TIME_FORMAT.format(new Date(step.finishedAt))}
                        </time>
                      ) : index === currentIndex ? (
                        scenario.statusLabel
                      ) : (
                        'Not started'
                      )}
                    </span>
                  </div>
                  <StepperDescription>{step.description}</StepperDescription>
                </div>
              </StepperItem>
            );
          })}
        </StepperList>
      </Stepper>
    </div>
  );
}
