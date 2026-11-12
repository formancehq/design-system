'use client';

import { ArrowRight, Radio } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/default/ui/empty';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/registry/default/ui/stepper';

const SETUP_STEPS = [
  'Enter the details of your EBICS contract',
  'Sign the INI letter and return it to your bank',
  'The channel becomes Active once the bank activates it',
];

export default function StepperSummary() {
  return (
    <Empty className="w-full max-w-xl border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Radio />
        </EmptyMedia>
        <EmptyTitle>Connect this channel to your bank</EmptyTitle>
        <EmptyDescription>
          Its EBICS connection is not configured yet, so there are no
          statements, files or transfers to show.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Stepper
          orientation="vertical"
          value="step-0"
          nonInteractive
          className="text-left"
        >
          <StepperList>
            {SETUP_STEPS.map((step, index) => (
              <StepperItem
                key={step}
                value={`step-${index}`}
                className="flex-row items-start gap-3"
              >
                <div className="flex flex-col items-center self-stretch">
                  <StepperTrigger>
                    <StepperIndicator />
                  </StepperTrigger>
                  <StepperSeparator className="my-1 min-h-3 flex-1" />
                </div>
                <StepperTitle className="block pt-1 pb-3">{step}</StepperTitle>
              </StepperItem>
            ))}
          </StepperList>
        </Stepper>
        <Button variant="primary" size="md" className="gap-2">
          Set up the connection
          <ArrowRight className="size-4" />
        </Button>
      </EmptyContent>
    </Empty>
  );
}
