'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import {
  FilterOperatorSelect,
  FilterValueInput,
} from '@/components/ui-fragments/filter-builder/filter-parts';
import {
  createFilterCondition,
  createFilterGroup,
  queryOfFilter,
  withFilterValue,
  type TFilterCondition,
  type TFilterFields,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { Button } from '@/registry/default/ui/button';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

const fields: TFilterFields = {
  status: {
    label: 'Status',
    variant: 'select',
    options: [
      { label: 'Succeeded', value: 'SUCCEEDED' },
      { label: 'Failed', value: 'FAILED' },
      { label: 'Pending', value: 'PENDING' },
    ],
  },
};

// A filter panel's section: the field is fixed, so each condition is drawn
// with its operator and its value only.
export default function FilterBuilderFixedField() {
  const [conditions, setConditions] = useState<TFilterCondition[]>(() => [
    {
      ...createFilterCondition(fields, 'status'),
      operator: 'ne',
      value: { kind: 'text', text: 'FAILED' },
    },
  ]);
  const change = (next: TFilterCondition) =>
    setConditions(conditions.map((one) => (one.id === next.id ? next : one)));
  const query = queryOfFilter(createFilterGroup('and', conditions), fields);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <div className="flex w-full max-w-xs flex-col gap-2">
        <span className="text-sm font-medium">Status</span>
        <ul className="flex flex-col gap-2">
          {conditions.map((condition) => (
            <li
              key={condition.id}
              className="flex flex-col gap-1 rounded-md border p-1.5"
            >
              <div className="flex items-center gap-1">
                <FilterOperatorSelect
                  condition={condition}
                  fields={fields}
                  onChange={change}
                  className="min-w-0 flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove condition"
                  onClick={() =>
                    setConditions(
                      conditions.filter((one) => one.id !== condition.id)
                    )
                  }
                >
                  <X />
                </Button>
              </div>
              <FilterValueInput
                condition={condition}
                fields={fields}
                timeZone="UTC"
                onChange={(value) =>
                  change(withFilterValue(condition, value, fields))
                }
                className="w-full"
              />
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 self-start"
          onClick={() =>
            setConditions([
              ...conditions,
              createFilterCondition(fields, 'status'),
            ])
          }
        >
          <Plus className="size-4" />
          Add condition
        </Button>
      </div>
      <CodeSnippet
        code={JSON.stringify(query ?? {}, null, 2)}
        language="json"
        size="sm"
      />
    </div>
  );
}
