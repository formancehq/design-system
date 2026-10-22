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

type TKnownIssueBoundaryState = { failed: boolean };

// In `next dev`, @shadcn/react 0.3.1 loops when one item has a choice and an
// input (see "Known issue" on the docs page). This boundary keeps the loop
// from taking down the whole page.
class KnownIssueBoundary extends React.Component<
  React.PropsWithChildren,
  TKnownIssueBoundaryState
> {
  state: TKnownIssueBoundaryState = { failed: false };

  static getDerivedStateFromError(): TKnownIssueBoundaryState {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <p className="mx-auto max-w-md text-sm text-muted-foreground">
        This example does not render in <code>next dev</code> with{' '}
        <code>@shadcn/react</code> 0.3.1. See Known issue below.
      </p>
    );
  }
}

export default function QuestionnaireFreeform() {
  return (
    <KnownIssueBoundary>
      <QuestionnaireFreeformForm />
    </KnownIssueBoundary>
  );
}

function QuestionnaireFreeformForm() {
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
