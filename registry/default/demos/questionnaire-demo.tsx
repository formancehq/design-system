'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/default/ui/questionnaire';

const items = [
  {
    choices: [
      { value: 'two-banks' },
      { value: 'multi-currency' },
      { value: 'interest' },
    ],
    name: 'difference',
    required: true,
  },
  {
    choices: [
      { value: 'deposits' },
      { value: 'withdrawals' },
      { value: 'fees' },
      { value: 'reconciliation' },
    ],
    name: 'flows',
  },
  {
    choices: [{ value: 'sandbox' }, { value: 'review' }, { value: 'draft' }],
    name: 'deploy',
    required: true,
  },
] as const;

export default function QuestionnaireDemo() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const answers = {
      difference: formData.get('difference'),
      flows: formData.getAll('flows'),
      deploy: formData.get('deploy'),
    };

    toast('Template adapted', {
      description: `Difference: ${answers.difference ?? 'None'} · Flows: ${answers.flows.join(', ') || 'None'} · Deploy: ${answers.deploy ?? 'None'}`,
    });
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="difference"
      items={items}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem name="difference" required>
        <QuestionnaireTitle>How does yours differ?</QuestionnaireTitle>
        <QuestionnaireDescription>
          The omnibus template holds client funds in one bank account. Choose
          what is different for you, or write it in your own words.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="two-banks">
            <span className="font-medium">Two banks, not one</span>
            <span className="text-muted-foreground">
              Client funds are split across two omnibus accounts.
            </span>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="multi-currency">
            <span className="font-medium">EUR and USD balances</span>
            <span className="text-muted-foreground">
              Each client holds a balance in both currencies.
            </span>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="interest">
            <span className="font-medium">Daily interest accrual</span>
            <span className="text-muted-foreground">
              Client balances earn interest every day.
            </span>
          </QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another difference"
            placeholder="Or write it in your own words"
          />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="flows" multiple>
        <QuestionnaireTitle>
          Which flows should the schema cover?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select all that apply, or skip this question.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="deposits">Deposits</QuestionnaireChoice>
          <QuestionnaireChoice value="withdrawals">
            Withdrawals
          </QuestionnaireChoice>
          <QuestionnaireChoice value="fees">Fees</QuestionnaireChoice>
          <QuestionnaireChoice value="reconciliation">
            Bank reconciliation
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="deploy" required>
        <QuestionnaireTitle>
          What happens after the design run?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose what the assistant does with the adapted schema.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="sandbox">
            Deploy to the sandbox ledger
          </QuestionnaireChoice>
          <QuestionnaireChoice value="review">
            Open it for review
          </QuestionnaireChoice>
          <QuestionnaireChoice value="draft">
            Save it as a draft
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Start design run</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
