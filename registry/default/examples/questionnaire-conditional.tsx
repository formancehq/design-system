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
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/registry/default/ui/questionnaire';

export default function QuestionnaireConditional() {
  const [runtime, setRuntime] = React.useState('local');
  const items = React.useMemo(
    () => [
      { name: 'runtime', required: true },
      {
        disabled: runtime !== 'cloud',
        name: 'environment',
        required: true,
      },
      { name: 'approval', required: true },
    ],
    [runtime]
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    toast('Deploy plan saved', {
      description: `Target: ${formData.get('runtime') ?? 'None'} · Environment: ${formData.get('environment') ?? 'Not applicable'} · Approval: ${formData.get('approval') ?? 'None'}`,
    });
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="runtime"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />

      <QuestionnaireItem name="runtime" required>
        <QuestionnaireTitle>Where should the schema go?</QuestionnaireTitle>
        <QuestionnaireDescription>
          A Formance Cloud stack adds an environment question to this flow.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice
            checked={runtime === 'local'}
            value="local"
            onChange={() => setRuntime('local')}
          >
            Local stack (formance-local)
          </QuestionnaireChoice>
          <QuestionnaireChoice
            checked={runtime === 'cloud'}
            value="cloud"
            onChange={() => setRuntime('cloud')}
          >
            Formance Cloud stack
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem
        disabled={runtime !== 'cloud'}
        name="environment"
        required
      >
        <QuestionnaireTitle>
          Which environment should it use?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="preview">Sandbox</QuestionnaireChoice>
          <QuestionnaireChoice value="staging">Staging</QuestionnaireChoice>
          <QuestionnaireChoice value="isolated">
            A new empty ledger
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="approval" required>
        <QuestionnaireTitle>
          When should the assistant ask for approval?
        </QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="writes">
            Before it edits the schema
          </QuestionnaireChoice>
          <QuestionnaireChoice value="commands">
            Before it deploys
          </QuestionnaireChoice>
          <QuestionnaireChoice value="sensitive">
            Only for production stacks
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Save deploy plan</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
