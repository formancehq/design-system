'use client';

import { useState } from 'react';

import { FilterBuilder } from '@/components/ui-fragments/filter-builder/filter-builder';
import {
  createFilterCondition,
  createFilterGroup,
  type TFilterFields,
} from '@/components/ui-fragments/filter-builder/filter-query';

const fields: TFilterFields = {
  reference: {
    label: 'Reference',
    variant: 'text',
    operators: [{ label: 'Exact match', value: 'eq' }],
    placeholder: 'Exact reference (full value)...',
  },
  metadata: {
    label: 'Metadata',
    variant: 'metadata',
    placeholderKey: 'Indexed metadata key...',
    placeholderValue: 'Exact value...',
  },
};

export default function FilterBuilderFlat() {
  const [filter, setFilter] = useState(() =>
    createFilterGroup('and', [
      createFilterCondition(fields, 'reference'),
      createFilterCondition(fields, 'metadata'),
    ])
  );

  return (
    <FilterBuilder
      className="w-full max-w-3xl"
      fields={fields}
      value={filter}
      onChange={setFilter}
      maxDepth={1}
    />
  );
}
