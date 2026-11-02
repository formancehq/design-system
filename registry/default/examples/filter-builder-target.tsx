'use client';

import { useState } from 'react';

import { FilterBar } from '@/components/ui-fragments/filter-builder/filter-bar';
import { FilterSuggestionList } from '@/components/ui-fragments/filter-builder/filter-parts';
import {
  createFilterCondition,
  createFilterGroup,
  findFilterGroup,
  updateFilterGroup,
  type TFilterFields,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { Button } from '@/registry/default/ui/button';

const fields: TFilterFields = {
  reference: { label: 'Reference', variant: 'text' },
  metadata: {
    label: 'Metadata',
    variant: 'metadata',
    placeholderKey: 'Key...',
    placeholderValue: 'Value...',
  },
};

// What a ledger would count: each indexed metadata key, and its values.
const counted: Record<string, Record<string, number>> = {
  type: { payment: 1204, refund: 87, fee: 312 },
  plan: { premium: 640, gold: 91, free: 2210 },
};

export default function FilterBuilderTarget() {
  const [filter, setFilter] = useState(() =>
    createFilterGroup('and', [
      createFilterCondition(fields, 'reference'),
      createFilterGroup('or', [createFilterCondition(fields, 'metadata')]),
    ])
  );
  const [targetId, setTargetId] = useState(filter.id);
  // A removed group gives the target back to the root.
  const target = findFilterGroup(filter, targetId) ?? filter;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-3">
      <FilterBar
        fields={fields}
        value={filter}
        onChange={setFilter}
        activeGroupId={target.id}
        onActiveGroupChange={setTargetId}
        suggestions={({ condition, part, text, pick }) => {
          if (condition.field !== 'metadata') {
            return null;
          }

          const values =
            part === 'key'
              ? Object.keys(counted).map((key) => ({ value: key }))
              : Object.entries(
                  condition.value.kind === 'keyed'
                    ? (counted[condition.value.key] ?? {})
                    : {}
                ).map(([value, count]) => ({ value, count }));

          return (
            <FilterSuggestionList
              items={values.filter((one) => one.value.includes(text))}
              onPick={pick}
            />
          );
        }}
      />
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setFilter(
              updateFilterGroup(filter, target.id, (group) => ({
                ...group,
                children: [
                  ...group.children,
                  createFilterCondition(fields, 'metadata'),
                ],
              }))
            )
          }
        >
          Add metadata to the {target.join} group
        </Button>
      </div>
    </div>
  );
}
