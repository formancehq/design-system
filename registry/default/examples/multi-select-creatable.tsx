'use client';

import { useState } from 'react';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectCreatable() {
  const [values, setValues] = useState<string[]>([]);
  const [options, setOptions] = useState([
    'bug',
    'feature',
    'enhancement',
    'documentation',
    'question',
  ]);

  return (
    <MultiSelect
      values={values}
      onValuesChange={(next) => {
        setValues(next);
        const newTags = next.filter((v) => !options.includes(v));
        if (newTags.length > 0) {
          setOptions((prev) => [...prev, ...newTags]);
        }
      }}
    >
      <MultiSelectTrigger className="w-[280px]">
        <MultiSelectValue placeholder="Add tags..." />
      </MultiSelectTrigger>
      <MultiSelectContent
        creatable
        search={{ placeholder: 'Search or create tags...', emptyMessage: 'Type to create a new tag.' }}
      >
        <MultiSelectGroup>
          {options.map((tag) => (
            <MultiSelectItem key={tag} value={tag}>
              {tag}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
