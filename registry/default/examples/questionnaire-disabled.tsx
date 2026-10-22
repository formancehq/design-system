'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/default/ui/questionnaire';

const items = [
  {
    choices: [
      { value: 'sandbox' },
      { value: 'staging' },
      { value: 'production', disabled: true },
    ],
    name: 'stack',
    required: true,
  },
] as const;

export default function QuestionnaireDisabled() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const stack = new FormData(event.currentTarget).get('stack');

    toast('Deploy target selected', {
      description: `Stack: ${stack ?? 'None'}`,
    });
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="stack"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireItem name="stack" required>
        <QuestionnaireTitle>Where should the schema go?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Production needs an approval from an organization admin.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="sandbox">
            <span className="font-medium">Sandbox</span>
            <QuestionnaireChoiceDescription>
              Test data, reset at any time
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="staging">
            <span className="font-medium">Staging</span>
            <QuestionnaireChoiceDescription>
              A copy of production for the final checks
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="production" disabled>
            <span className="font-medium">Production</span>
            <QuestionnaireChoiceDescription>
              Live client funds
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Deploy schema</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
