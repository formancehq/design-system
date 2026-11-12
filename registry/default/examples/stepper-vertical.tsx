'use client';

import { Button } from '@/registry/default/ui/button';
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNextTrigger,
  StepperPrevTrigger,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/registry/default/ui/stepper';

const STEPS = [
  {
    value: 'ledger',
    title: 'Ledger',
    description: 'Name the ledger',
    body: 'Pick a name for the ledger. It is part of every API path, so it cannot change later.',
  },
  {
    value: 'chart',
    title: 'Chart of accounts',
    description: 'Describe the accounts',
    body: 'Declare the account patterns the ledger accepts, for example users:$userID:wallet.',
  },
  {
    value: 'review',
    title: 'Review',
    description: 'Confirm and create',
    body: 'Check the name and the chart of accounts, then create the ledger.',
  },
];

export default function StepperVertical() {
  return (
    <Stepper
      defaultValue="ledger"
      orientation="vertical"
      className="w-full max-w-2xl"
    >
      <StepperList className="shrink-0">
        {STEPS.map((step) => (
          <StepperItem
            key={step.value}
            value={step.value}
            className="items-start"
          >
            <StepperTrigger className="items-start">
              <StepperIndicator />
              <div className="flex flex-col pt-1">
                <StepperTitle>{step.title}</StepperTitle>
                <StepperDescription>{step.description}</StepperDescription>
              </div>
            </StepperTrigger>
            <StepperSeparator className="my-1 ms-3.5 -translate-x-1/2" />
          </StepperItem>
        ))}
      </StepperList>

      <div className="flex flex-1 flex-col gap-6 border-s ps-6">
        {STEPS.map((step) => (
          <StepperContent
            key={step.value}
            value={step.value}
            className="flex flex-col gap-1"
          >
            <p className="font-medium text-sm">{step.title}</p>
            <p className="text-muted-foreground text-sm">{step.body}</p>
          </StepperContent>
        ))}

        <div className="flex justify-between">
          <StepperPrevTrigger asChild>
            <Button variant="outline" size="md">
              Previous
            </Button>
          </StepperPrevTrigger>
          <StepperNextTrigger asChild>
            <Button variant="primary" size="md">
              Next
            </Button>
          </StepperNextTrigger>
        </div>
      </div>
    </Stepper>
  );
}
