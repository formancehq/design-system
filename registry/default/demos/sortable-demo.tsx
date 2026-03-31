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

const initialItems = [
  { id: '1', label: 'Build the design system' },
  { id: '2', label: 'Port sortable component' },
  { id: '3', label: 'Create key-value input' },
  { id: '4', label: 'Write documentation' },
];

export default function SortableDemo() {
  const [items, setItems] = useState(initialItems);

  return (
    <Sortable
      value={items}
      onValueChange={setItems}
      getItemValue={(item) => item.id}
    >
      <SortableContent className="flex flex-col gap-2">
        {items.map((item) => (
          <SortableItem
            key={item.id}
            value={item.id}
            className="flex items-center gap-2 rounded-md border bg-background px-3 py-2"
          >
            <SortableItemHandle asChild>
              <button
                type="button"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <GripVertical className="size-4" />
                <span className="sr-only">Drag to reorder</span>
              </button>
            </SortableItemHandle>
            <span className="font-mono text-sm">{item.label}</span>
          </SortableItem>
        ))}
      </SortableContent>
      <SortableOverlay>
        {({ value: activeId }) => {
          const item = items.find((i) => i.id === activeId);
          if (!item) return null;
          return (
            <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 shadow-lg">
              <GripVertical className="size-4 text-muted-foreground" />
              <span className="font-mono text-sm">{item.label}</span>
            </div>
          );
        }}
      </SortableOverlay>
    </Sortable>
  );
}
