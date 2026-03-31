'use client';

import { GripVertical } from 'lucide-react';
import { useState } from 'react';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/registry/default/ui/sortable';

const initialTags = [
  { id: '1', label: 'React' },
  { id: '2', label: 'TypeScript' },
  { id: '3', label: 'Tailwind' },
  { id: '4', label: 'Next.js' },
];

export default function SortableHorizontal() {
  const [tags, setTags] = useState(initialTags);

  return (
    <Sortable
      value={tags}
      onValueChange={setTags}
      getItemValue={(tag) => tag.id}
      orientation="horizontal"
    >
      <SortableContent className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <SortableItem
            key={tag.id}
            value={tag.id}
            className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1"
          >
            <SortableItemHandle asChild>
              <button
                type="button"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <GripVertical className="size-3" />
                <span className="sr-only">Drag to reorder</span>
              </button>
            </SortableItemHandle>
            <span className="font-mono text-sm">{tag.label}</span>
          </SortableItem>
        ))}
      </SortableContent>
      <SortableOverlay>
        {({ value: activeId }) => {
          const tag = tags.find((t) => t.id === activeId);
          if (!tag) return null;
          return (
            <div className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 shadow-lg">
              <GripVertical className="size-3 text-muted-foreground" />
              <span className="font-mono text-sm">{tag.label}</span>
            </div>
          );
        }}
      </SortableOverlay>
    </Sortable>
  );
}
