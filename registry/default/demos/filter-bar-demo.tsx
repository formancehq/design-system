'use client';

import { useState } from 'react';

import { FilterBar } from '@/components/ui-fragments/filter-builder/filter-bar';
import {
  createFilterGroup,
  filterOfQuery,
  queryOfFilter,
  type TFilterFields,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

// The Ledger v3 transactions vocabulary, in the shape of the platform's
// `FilterConfig` (`@platform/query/filters/ledger/v3-transactions.ts`).
const fields: TFilterFields = {
  reference: {
    label: 'Reference',
    variant: 'text',
    operators: [{ label: 'Exact match', value: 'eq' }],
    placeholder: 'Exact reference...',
  },
  source: {
    label: 'Source',
    variant: 'text',
    operators: [{ label: 'Exact match', value: 'eq' }],
    placeholder: 'Account (e.g. world)...',
  },
  metadata: {
    label: 'Metadata',
    variant: 'metadata',
    operators: [
      { label: 'Match', value: 'eq' },
      { label: 'Is not', value: 'ne' },
      { label: 'Is any of', value: 'in' },
    ],
    placeholderKey: 'Key...',
    placeholderValue: 'Value...',
  },
  id: {
    label: 'ID',
    variant: 'number',
    operators: [
      { label: 'Exact match', value: 'eq' },
      { label: 'Greater than', value: 'gt' },
      { label: 'Lower than', value: 'lt' },
    ],
    placeholder: 'Transaction ID...',
  },
  timestamp: { label: 'Timestamp', variant: 'dateRange' },
  reverted: {
    label: 'Reverted',
    variant: 'boolean',
    operators: [{ label: 'Exact match', value: 'eq' }],
  },
};

// Payments that were not reverted, or refunds past transaction 100.
const storedQuery = {
  $or: [
    {
      $and: [
        { $match: { 'metadata[type]': 'payment' } },
        { $match: { reverted: false } },
      ],
    },
    {
      $and: [{ $match: { 'metadata[type]': 'refund' } }, { $gt: { id: 100 } }],
    },
  ],
};

export default function FilterBarDemo() {
  const [filter, setFilter] = useState(
    () => filterOfQuery(storedQuery, fields) ?? createFilterGroup()
  );

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <FilterBar fields={fields} value={filter} onChange={setFilter} />
      <CodeSnippet
        code={JSON.stringify(queryOfFilter(filter, fields) ?? {}, null, 2)}
        language="json"
        size="sm"
      />
    </div>
  );
}
