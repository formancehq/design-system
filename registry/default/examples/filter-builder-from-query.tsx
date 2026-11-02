'use client';

import { useState } from 'react';

import { FilterBuilder } from '@/components/ui-fragments/filter-builder/filter-builder';
import {
  filterOfQuery,
  queryOfFilter,
  type TFilterFields,
  type TFilterGroup,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { Textarea } from '@/registry/default/ui/textarea';

const fields: TFilterFields = {
  reference: { label: 'Reference', variant: 'text' },
  metadata: { label: 'Metadata', variant: 'metadata' },
  id: { label: 'ID', variant: 'number' },
  reverted: { label: 'Reverted', variant: 'boolean' },
};

const initialText = JSON.stringify(
  {
    $and: [
      { $not: { $match: { 'metadata[type]': 'fee' } } },
      {
        $or: [{ $match: { reference: 'order-1' } }, { $gte: { id: 100 } }],
      },
    ],
  },
  null,
  2
);

/**
 * The filter a typed query is drawn as: `null` when the text is not a JSON
 * object, or when the builder cannot hold the query exactly.
 */
function readFilter(text: string): TFilterGroup | null {
  try {
    const parsed: unknown = JSON.parse(text);

    return typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
      ? filterOfQuery(parsed as Record<string, unknown>, fields)
      : null;
  } catch {
    return null;
  }
}

export default function FilterBuilderFromQuery() {
  const [text, setText] = useState(initialText);
  // Held in state, not read on each render: a node's id is its React key, so
  // reading the text again on each keystroke would remount every input.
  const [filter, setFilter] = useState(() => readFilter(initialText));

  const write = (next: TFilterGroup) => {
    setFilter(next);
    setText(JSON.stringify(queryOfFilter(next, fields) ?? {}, null, 2));
  };

  return (
    <div className="grid w-full max-w-5xl gap-4 lg:grid-cols-[2fr_3fr]">
      <Textarea
        aria-label="Stored query"
        className="min-h-64 font-mono text-xs"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setFilter(readFilter(event.target.value));
        }}
      />
      {filter ? (
        <FilterBuilder fields={fields} value={filter} onChange={write} />
      ) : (
        <p className="text-muted-foreground text-sm">
          The builder cannot hold this query exactly, so it opens in the raw
          editor.
        </p>
      )}
    </div>
  );
}
