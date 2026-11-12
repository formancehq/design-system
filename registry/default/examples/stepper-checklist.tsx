'use client';

import { Check, Lock } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/registry/default/ui/button';
import { Card, CardContent } from '@/registry/default/ui/card';
import { Checkbox } from '@/registry/default/ui/checkbox';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/registry/default/ui/stepper';
import { cn } from '@/lib/utils';

const CHECKLIST = [
  {
    title: 'Request EBICS access from your bank',
    body: 'Your bank sets up an EBICS contract and sends its details: the server URL, the Host ID, your Partner ID and your User ID.',
  },
  {
    title: 'Banking Bridge generates your keys',
    body: 'When you submit, Banking Bridge generates the EBICS keys for this channel and sends them to the bank. This happens only once.',
  },
  {
    title: 'Sign and return the INI letter',
    body: 'Someone authorized on the bank account signs the INI letter and returns it to the bank.',
  },
  {
    title: 'Wait for your bank',
    body: 'The bank activates the contract, which can take several days. The channel then becomes Active by itself.',
  },
];

export default function StepperChecklist() {
  const [confirmed, setConfirmed] = React.useState(0);
  const allConfirmed = confirmed === CHECKLIST.length;

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <Card>
        <CardContent>
          <Stepper
            orientation="vertical"
            value={`item-${Math.min(confirmed, CHECKLIST.length - 1)}`}
            nonInteractive
          >
            <StepperList>
              {CHECKLIST.map((item, index) => {
                const isLocked = index > confirmed;
                const checkboxId = `stepper-checklist-${index}`;

                return (
                  <StepperItem
                    key={item.title}
                    value={`item-${index}`}
                    className="flex-row items-start gap-4"
                  >
                    <div className="flex flex-col items-center self-stretch">
                      <StepperTrigger>
                        <StepperIndicator>
                          {isLocked ? (
                            <Lock className="size-3.5" />
                          ) : index < confirmed ? (
                            <Check className="size-4" />
                          ) : (
                            index + 1
                          )}
                        </StepperIndicator>
                      </StepperTrigger>
                      <StepperSeparator className="my-1 min-h-6 flex-1" />
                    </div>
                    <div className="flex flex-col gap-3 pb-6">
                      <StepperTitle
                        className={cn(
                          'block pt-1',
                          isLocked && 'text-muted-foreground'
                        )}
                      >
                        {item.title}
                      </StepperTitle>
                      {isLocked ? (
                        <p className="text-muted-foreground text-sm">
                          Confirm the step above to read this one.
                        </p>
                      ) : (
                        <>
                          <p className="text-muted-foreground text-sm">
                            {item.body}
                          </p>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={checkboxId}
                              checked={index < confirmed}
                              onCheckedChange={(checked) =>
                                setConfirmed(
                                  checked === true ? index + 1 : index
                                )
                              }
                            />
                            <label htmlFor={checkboxId} className="text-sm">
                              I understand
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  </StepperItem>
                );
              })}
            </StepperList>
          </Stepper>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" size="md" disabled={!allConfirmed}>
          Continue
        </Button>
      </div>
    </div>
  );
}
