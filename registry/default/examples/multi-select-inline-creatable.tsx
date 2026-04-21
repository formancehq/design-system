'use client';

import { useState } from 'react';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectInput,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/registry/default/ui/multi-select';

export default function MultiSelectInlineCreatable() {
  const [values, setValues] = useState<string[]>([]);
  const [options, setOptions] = useState([
    'bug',
    'feature',
    'enhancement',
    'documentation',
  ]);

  return (
    <MultiSelect
      mode="inline"
      values={values}
      onValuesChange={(next) => {
        setValues(next);
        const newTags = next.filter((v) => !options.includes(v));
        if (newTags.length > 0) {
          setOptions((prev) => [...prev, ...newTags]);
        }
      }}
    >
      <MultiSelectTrigger className="w-[320px] flex-wrap">
        <MultiSelectValue
          placeholder="Add tags..."
          overflowBehavior="wrap"
          clickToRemove
        />
        <MultiSelectInput placeholder="Search or create..." />
      </MultiSelectTrigger>
      <MultiSelectContent creatable>
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
