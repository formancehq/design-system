'use client';

import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperTitle,
  StepperTrigger,
} from '@/registry/default/ui/stepper';

const STEPS = [
  {
    value: 'sign-in',
    title: 'Sign in',
    description: 'fctl uses your Formance identity.',
    code: 'fctl login',
  },
  {
    value: 'proxy',
    title: 'Start the proxy',
    description: 'It signs each request with your identity, on port 55001.',
    code: 'fctl stack proxy --organization <organization-id> --stack <stack-id>',
  },
  {
    value: 'call',
    title: 'Call the stack',
    description: 'Any tool on this computer calls the stack through the proxy.',
    code: 'curl http://localhost:55001/versions',
  },
];

export default function StepperGuide() {
  return (
    <section className="flex w-full max-w-4xl flex-col gap-6">
      <h3 className="font-medium text-sm">Follow these steps</h3>
      <Stepper orientation="vertical" nonInteractive>
        <StepperList className="w-full gap-6">
          {STEPS.map((step) => (
            <StepperItem
              key={step.value}
              value={step.value}
              className="grid w-full items-start gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-6"
            >
              <StepperTrigger className="items-start justify-start">
                <StepperIndicator className="border border-border" />
                <div className="flex flex-col gap-1 pt-1">
                  <StepperTitle>{step.title}</StepperTitle>
                  <StepperDescription className="text-sm">
                    {step.description}
                  </StepperDescription>
                </div>
              </StepperTrigger>
              <CodeSnippet code={step.code} language="bash" showHeader />
            </StepperItem>
          ))}
        </StepperList>
      </Stepper>
    </section>
  );
}
