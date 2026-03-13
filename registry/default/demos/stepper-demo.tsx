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

export default function StepperDemo() {
  return (
    <Stepper defaultValue="account" className="w-full max-w-lg">
      <StepperList>
        <StepperItem value="account">
          <StepperTrigger>
            <StepperIndicator />
            <div className="flex flex-col">
              <StepperTitle>Account</StepperTitle>
              <StepperDescription>Set up your account</StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem value="ledger">
          <StepperTrigger>
            <StepperIndicator />
            <div className="flex flex-col">
              <StepperTitle>Ledger</StepperTitle>
              <StepperDescription>Create a ledger</StepperDescription>
            </div>
          </StepperTrigger>
          <StepperSeparator />
        </StepperItem>
        <StepperItem value="review">
          <StepperTrigger>
            <StepperIndicator />
            <div className="flex flex-col">
              <StepperTitle>Review</StepperTitle>
              <StepperDescription>Confirm details</StepperDescription>
            </div>
          </StepperTrigger>
        </StepperItem>
      </StepperList>

      <StepperContent value="account">
        <p className="text-muted-foreground text-sm">
          Configure your account settings and preferences.
        </p>
      </StepperContent>
      <StepperContent value="ledger">
        <p className="text-muted-foreground text-sm">
          Create and configure your first ledger.
        </p>
      </StepperContent>
      <StepperContent value="review">
        <p className="text-muted-foreground text-sm">
          Review your configuration before finalizing.
        </p>
      </StepperContent>

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
    </Stepper>
  );
}
