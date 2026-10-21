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
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/default/ui/questionnaire';

const items = [
  {
    choices: [
      { value: 'source' },
      { value: 'tests' },
      { value: 'docs' },
      { value: 'history' },
    ],
    name: 'context',
    required: true,
  },
] as const;

export default function QuestionnaireMultiple() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const context = new FormData(event.currentTarget).getAll('context');

    toast('Inputs selected', {
      description: `Inputs: ${context.join(', ') || 'None'}`,
    });
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      items={items}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireItem name="context" multiple required>
        <QuestionnaireTitle>
          What should the assistant read first?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select every input that may affect the schema.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="source">
            The current ledger schema
          </QuestionnaireChoice>
          <QuestionnaireChoice value="tests">
            Recent design runs
          </QuestionnaireChoice>
          <QuestionnaireChoice value="docs">
            The chart of accounts
          </QuestionnaireChoice>
          <QuestionnaireChoice value="history">
            Numscript templates
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnaireSubmit>Share inputs</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
