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
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/default/ui/questionnaire';

const items = [
  {
    choices: [
      { value: 'incremental' },
      { value: 'module' },
      { value: 'rewrite' },
    ],
    name: 'approach',
    required: true,
  },
] as const;

export default function QuestionnaireFreeform() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const approach = new FormData(event.currentTarget).get('approach');

    toast('Change selected', {
      description: `Change: ${approach ?? 'None'}`,
    });
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      items={items}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireItem name="approach" required>
        <QuestionnaireTitle>
          How should the assistant change the schema?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose a change or write a more specific instruction.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="incremental">
            Add one account and keep the rest
          </QuestionnaireChoice>
          <QuestionnaireChoice value="module">
            Split the omnibus account per bank
          </QuestionnaireChoice>
          <QuestionnaireChoice value="rewrite">
            Start again from a new template
          </QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another schema change"
            placeholder="Describe another change…"
          />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnaireSubmit>Draft the edit</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
