'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/registry/default/ui/sortable';
import { Eye, GripVertical, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

type TKeyValuePair = {
  id: string;
  key: string;
  value: string;
};

let counter = 0;
function uniqueId() {
  return `kv-${Date.now()}-${++counter}`;
}

type TKeyValueInputProps = {
  value?: TKeyValuePair[];
  onValueChange?: (pairs: TKeyValuePair[]) => void;
  defaultValue?: TKeyValuePair[];
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
  showJson?: boolean;
  disabled?: boolean;
  className?: string;
};

function KeyValueInput({
  value: valueProp,
  onValueChange,
  defaultValue,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  addLabel = 'Add row',
  showJson = false,
  disabled = false,
  className,
}: TKeyValueInputProps) {
  const [internalValue, setInternalValue] = React.useState<TKeyValuePair[]>(
    () => defaultValue ?? [{ id: uniqueId(), key: '', value: '' }]
  );

  const isControlled = valueProp !== undefined;
  const pairs = isControlled ? valueProp : internalValue;

  const setPairs = React.useCallback(
    (next: TKeyValuePair[] | ((prev: TKeyValuePair[]) => TKeyValuePair[])) => {
      const resolved = typeof next === 'function' ? next(pairs) : next;
      if (!isControlled) {
        setInternalValue(resolved);
      }
      onValueChange?.(resolved);
    },
    [pairs, isControlled, onValueChange]
  );

  const handleAdd = React.useCallback(() => {
    setPairs((prev) => [...prev, { id: uniqueId(), key: '', value: '' }]);
  }, [setPairs]);

  const handleRemove = React.useCallback(
    (id: string) => {
      setPairs((prev) => prev.filter((pair) => pair.id !== id));
    },
    [setPairs]
  );

  const handleUpdate = React.useCallback(
    (id: string, field: 'key' | 'value', fieldValue: string) => {
      setPairs((prev) =>
        prev.map((pair) =>
          pair.id === id ? { ...pair, [field]: fieldValue } : pair
        )
      );
    },
    [setPairs]
  );

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Sortable
        value={pairs}
        onValueChange={setPairs}
        getItemValue={(pair) => pair.id}
        orientation="vertical"
        flatCursor
      >
        <SortableContent className="flex flex-col gap-2">
          {pairs.map((pair) => (
            <KeyValueRow
              key={pair.id}
              pair={pair}
              keyPlaceholder={keyPlaceholder}
              valuePlaceholder={valuePlaceholder}
              disabled={disabled}
              canRemove={pairs.length > 1}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </SortableContent>
        <SortableOverlay>
          {({ value: activeId }) => {
            const activePair = pairs.find((p) => p.id === activeId);
            if (!activePair) return null;
            return (
              <KeyValueRow
                pair={activePair}
                keyPlaceholder={keyPlaceholder}
                valuePlaceholder={valuePlaceholder}
                disabled
                canRemove={false}
                onUpdate={() => {}}
                onRemove={() => {}}
              />
            );
          }}
        </SortableOverlay>
      </Sortable>
      <div className="flex items-center justify-end gap-2 pr-10">
        {showJson && <KeyValueJsonPreview pairs={pairs} />}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={disabled}
          className="gap-1.5"
        >
          <Plus className="size-3.5" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

type TKeyValueRowProps = {
  pair: TKeyValuePair;
  keyPlaceholder: string;
  valuePlaceholder: string;
  disabled: boolean;
  canRemove: boolean;
  onUpdate: (id: string, field: 'key' | 'value', value: string) => void;
  onRemove: (id: string) => void;
};

function KeyValueRow({
  pair,
  keyPlaceholder,
  valuePlaceholder,
  disabled,
  canRemove,
  onUpdate,
  onRemove,
}: TKeyValueRowProps) {
  return (
    <SortableItem
      value={pair.id}
      className="flex items-center gap-2 rounded-md"
      disabled={disabled}
    >
      <SortableItemHandle asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="size-8 shrink-0"
          disabled={disabled}
        >
          <GripVertical className="size-4 text-muted-foreground" />
          <span className="sr-only">Drag to reorder</span>
        </Button>
      </SortableItemHandle>
      <Input
        size="sm"
        placeholder={keyPlaceholder}
        value={pair.key}
        onChange={(e) => onUpdate(pair.id, 'key', e.target.value)}
        disabled={disabled}
        className="flex-1"
      />
      <Input
        size="sm"
        placeholder={valuePlaceholder}
        value={pair.value}
        onChange={(e) => onUpdate(pair.id, 'value', e.target.value)}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => onRemove(pair.id)}
        disabled={disabled || !canRemove}
      >
        <Trash2 />
        <span className="sr-only">Remove row</span>
      </Button>
    </SortableItem>
  );
}

function KeyValueJsonPreview({ pairs }: { pairs: TKeyValuePair[] }) {
  const json = React.useMemo(() => {
    const obj: Record<string, string> = {};
    for (const pair of pairs) {
      if (pair.key) obj[pair.key] = pair.value;
    }
    return JSON.stringify(obj, null, 2);
  }, [pairs]);

  return (
    <Popover>
      <PopoverTrigger asChild size="sm">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="justify-center"
        >
          <Eye />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <pre className="max-h-64 overflow-auto p-3 font-mono text-xs text-muted-foreground">
          {json}
        </pre>
      </PopoverContent>
    </Popover>
  );
}

export { KeyValueInput, type TKeyValueInputProps, type TKeyValuePair };
