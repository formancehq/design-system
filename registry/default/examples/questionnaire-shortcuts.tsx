'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';
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
    choices: [{ value: 'inspect' }, { value: 'tests' }, { value: 'patch' }],
    name: 'action',
    required: true,
  },
] as const;

type ShortcutMode = React.ComponentProps<typeof Questionnaire>['shortcuts'];

export default function QuestionnaireShortcuts() {
  const [shortcuts, setShortcuts] = React.useState<ShortcutMode>('letters');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const action = new FormData(event.currentTarget).get('action');

    toast('Next action selected', {
      description: `Action: ${action ?? 'None'} · Shortcuts: ${shortcuts ?? 'none'}`,
    });
  }

  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col">
      <Select
        value={shortcuts ?? 'none'}
        onValueChange={(value) =>
          setShortcuts(
            value === 'letters' || value === 'numbers' ? value : undefined
          )
        }
      >
        <SelectTrigger
          aria-label="Shortcut style"
          size="sm"
          className="absolute end-0 top-0"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No shortcuts</SelectItem>
          <SelectItem value="letters">Letters</SelectItem>
          <SelectItem value="numbers">Numbers</SelectItem>
        </SelectContent>
      </Select>

      <Questionnaire
        className="mt-auto"
        items={items}
        shortcuts={shortcuts}
        onSubmit={handleSubmit}
      >
        <QuestionnaireItem name="action" required>
          <QuestionnaireTitle>
            What should the agent do next?
          </QuestionnaireTitle>
          <QuestionnaireDescription>
            Use the displayed shortcut or navigate with the keyboard.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="inspect">
              Inspect the implementation
            </QuestionnaireChoice>
            <QuestionnaireChoice value="tests">
              Run the relevant tests
            </QuestionnaireChoice>
            <QuestionnaireChoice value="patch">
              Prepare the patch
            </QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireActions>
          <QuestionnaireSubmit>Confirm action</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  );
}
