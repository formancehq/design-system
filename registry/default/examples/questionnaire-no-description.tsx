'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
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
    choices: [{ value: 'inspect' }, { value: 'draft' }, { value: 'review' }],
    name: 'task',
    required: true,
  },
] as const;

export default function QuestionnaireNoDescription() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const task = new FormData(event.currentTarget).get('task');

    toast('Next step selected', { description: `Task: ${task ?? 'None'}` });
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="task"
      items={items}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem name="task" required>
        <QuestionnaireTitle>What should the agent do next?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="inspect">
            Inspect the ledger schema
          </QuestionnaireChoice>
          <QuestionnaireChoice value="draft">
            Draft the Numscript
          </QuestionnaireChoice>
          <QuestionnaireChoice value="review">
            Review the transactions
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Confirm step</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
