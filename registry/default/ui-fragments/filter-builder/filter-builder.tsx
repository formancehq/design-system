'use client';

import {
  CalendarIcon,
  ChevronsUpDown,
  GripVertical,
  ListPlus,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import {
  createFilterCondition,
  createFilterGroup,
  filterOperators,
  filterValueFor,
  type TFilterCondition,
  type TFilterFields,
  type TFilterGroup,
  type TFilterJoin,
  type TFilterNode,
  type TFilterValue,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';
import { Input } from '@/registry/default/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from '@/registry/default/ui/sortable';

// A filter is a tree: a group joins its children with one `$and` or one
// `$or`, and a child is a condition or another group. The builder draws each
// group as rows, the way the data table's flat filters are drawn ("Where",
// then the join, then the join again), and a nested group as a framed block in
// its parent's row. The pure model lives in `filter-query.ts`.

type TFilterBuilderProps = {
  /** The resource's vocabulary. A platform `FilterConfig` fits as it is. */
  fields: TFilterFields;
  /** The root group. Start from `createFilterGroup()` or `filterOfQuery()`. */
  value: TFilterGroup;
  onChange: (value: TFilterGroup) => void;
  /**
   * How many levels of groups the reader can open. `1` is a flat list, as the
   * data table's filters are today; `2` holds an `$or` of `$and`s.
   */
  maxDepth?: number;
  className?: string;
};

type TGroupScope = {
  fields: TFilterFields;
  depth: number;
  maxDepth: number;
};

const DAY_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function FilterBuilder({
  fields,
  value,
  onChange,
  maxDepth = 2,
  className,
}: TFilterBuilderProps) {
  return (
    <div
      data-slot="filter-builder"
      className={cn('flex flex-col gap-3', className)}
    >
      <FilterGroupBody
        group={value}
        onChange={onChange}
        scope={{ fields, depth: 1, maxDepth }}
        footer={
          value.children.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => onChange(createFilterGroup(value.join))}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          )
        }
      />
    </div>
  );
}

function FilterGroupBody({
  group,
  onChange,
  scope,
  footer,
}: {
  group: TFilterGroup;
  onChange: (group: TFilterGroup) => void;
  scope: TGroupScope;
  footer?: React.ReactNode;
}) {
  const setChildren = (children: readonly TFilterNode[]) =>
    onChange({ ...group, children });
  const canNest = scope.depth < scope.maxDepth;
  // A new group takes the other join: under an `$or`, the group a reader
  // opens is almost always an `$and`, and the reverse.
  const nestedJoin: TFilterJoin = group.join === 'and' ? 'or' : 'and';

  return (
    <div className="flex flex-col gap-2">
      {group.children.length === 0 ? (
        <p className="text-muted-foreground px-1 text-sm">
          {scope.depth === 1
            ? 'No filters: every row is shown.'
            : 'An empty group filters nothing.'}
        </p>
      ) : (
        <Sortable
          value={[...group.children]}
          getItemValue={(node: TFilterNode) => node.id}
          onValueChange={setChildren}
        >
          <SortableContent className="flex flex-col gap-2">
            {group.children.map((node, index) => (
              <FilterRow
                key={node.id}
                node={node}
                index={index}
                join={group.join}
                scope={scope}
                onJoinChange={(join) => onChange({ ...group, join })}
                onChange={(next) =>
                  setChildren(
                    group.children.map((one) =>
                      one.id === next.id ? next : one
                    )
                  )
                }
                onRemove={() =>
                  setChildren(group.children.filter((one) => one !== node))
                }
              />
            ))}
          </SortableContent>
        </Sortable>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={scope.depth === 1 ? 'primary' : 'outline'}
          className="gap-1.5"
          onClick={() =>
            setChildren([
              ...group.children,
              createFilterCondition(scope.fields),
            ])
          }
        >
          <Plus className="size-3.5" />
          Add filter
        </Button>
        {canNest && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              setChildren([
                ...group.children,
                createFilterGroup(nestedJoin, [
                  createFilterCondition(scope.fields),
                ]),
              ])
            }
          >
            <ListPlus className="size-3.5" />
            Add group
          </Button>
        )}
        {footer}
      </div>
    </div>
  );
}

function FilterRow({
  node,
  index,
  join,
  scope,
  onJoinChange,
  onChange,
  onRemove,
}: {
  node: TFilterNode;
  index: number;
  join: TFilterJoin;
  scope: TGroupScope;
  onJoinChange: (join: TFilterJoin) => void;
  onChange: (node: TFilterNode) => void;
  onRemove: () => void;
}) {
  if (node.kind === 'group') {
    // A group's remove and drag controls sit in its own footer, not in a
    // column beside the frame, so a nested row keeps that width for values.
    return (
      <SortableItem value={node.id} className="flex items-start gap-2">
        <FilterJoinCell index={index} join={join} onChange={onJoinChange} />
        <div
          data-slot="filter-group"
          className="bg-muted/40 min-w-0 flex-1 rounded-md border border-dashed p-2"
        >
          <FilterGroupBody
            group={node}
            onChange={onChange}
            scope={{ ...scope, depth: scope.depth + 1 }}
            footer={
              <div className="ml-auto flex gap-2">
                <FilterRowActions
                  label="Remove group"
                  size="icon-sm"
                  onRemove={onRemove}
                />
              </div>
            }
          />
        </div>
      </SortableItem>
    );
  }

  return (
    <SortableItem value={node.id} className="flex items-start gap-2">
      <FilterJoinCell index={index} join={join} onChange={onJoinChange} />
      <FilterConditionEditor
        condition={node}
        fields={scope.fields}
        onChange={onChange}
      />
      <FilterRowActions
        label="Remove filter"
        size="icon-md"
        onRemove={onRemove}
      />
    </SortableItem>
  );
}

/** Remove, then the drag handle. Rendered inside its row's `SortableItem`. */
function FilterRowActions({
  label,
  size,
  onRemove,
}: {
  label: string;
  size: 'icon-sm' | 'icon-md';
  onRemove: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={size}
        className="shrink-0"
        onClick={onRemove}
      >
        <Trash2 />
        <span className="sr-only">{label}</span>
      </Button>
      <SortableItemHandle asChild>
        <Button
          type="button"
          variant="outline"
          size={size}
          className="shrink-0"
        >
          <GripVertical className="text-muted-foreground" />
          <span className="sr-only">Drag to reorder</span>
        </Button>
      </SortableItemHandle>
    </>
  );
}

/**
 * The cell before a row: "Where" on the first, the group's join as a choice
 * on the second, and the same join as text after it. One group has one join,
 * so it is chosen once.
 */
function FilterJoinCell({
  index,
  join,
  onChange,
}: {
  index: number;
  join: TFilterJoin;
  onChange: (join: TFilterJoin) => void;
}) {
  if (index !== 1) {
    return (
      <span className="text-muted-foreground flex h-8 w-18 shrink-0 items-center px-2 text-sm">
        {index === 0 ? 'Where' : join}
      </span>
    );
  }

  return (
    <Select
      value={join}
      onValueChange={(next) => onChange(next === 'or' ? 'or' : 'and')}
    >
      <SelectTrigger aria-label="Join" className="w-18 shrink-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="and">and</SelectItem>
        <SelectItem value="or">or</SelectItem>
      </SelectContent>
    </Select>
  );
}

function FilterConditionEditor({
  condition,
  fields,
  onChange,
}: {
  condition: TFilterCondition;
  fields: TFilterFields;
  onChange: (condition: TFilterCondition) => void;
}) {
  const field = fields[condition.field];
  const operators = field ? filterOperators(field) : [];

  return (
    <div className="flex min-w-0 flex-1 items-start gap-2">
      <Select
        value={condition.field}
        onValueChange={(next) =>
          onChange({ ...createFilterCondition(fields, next), id: condition.id })
        }
      >
        <SelectTrigger
          aria-label="Field"
          className="w-32 shrink-0 font-mono text-xs uppercase"
          icon={<ChevronsUpDown className="size-4 opacity-50" />}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(fields).map(([key, one]) => (
            <SelectItem key={key} value={key}>
              {one.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={condition.operator}
        onValueChange={(next) => {
          const operator = operators.find((one) => one.value === next)?.value;

          if (operator) {
            onChange({
              ...condition,
              operator,
              value: filterValueFor(field, operator, condition.value),
            });
          }
        }}
      >
        <SelectTrigger aria-label="Operator" className="w-32 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operators.map((one) => (
            <SelectItem key={one.value} value={one.value}>
              {one.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FilterValueInput
        condition={condition}
        fields={fields}
        onChange={(value) => onChange({ ...condition, value })}
        className="min-w-0 flex-1"
      />
    </div>
  );
}

function FilterValueInput({
  condition,
  fields,
  onChange,
  className,
}: {
  condition: TFilterCondition;
  fields: TFilterFields;
  onChange: (value: TFilterValue) => void;
  /** Given to each control the value takes: one, or two for a keyed value. */
  className?: string;
}) {
  const field = fields[condition.field];
  const { value } = condition;
  const takesValue =
    condition.operator !== 'isEmpty' && condition.operator !== 'isNotEmpty';

  switch (value.kind) {
    case 'instants':
      return (
        <FilterRangeInput
          value={value}
          onChange={onChange}
          className={className}
        />
      );
    case 'keyed':
      return (
        <>
          <Input
            aria-label="Key"
            className={className}
            placeholder={field?.placeholderKey ?? 'Key...'}
            value={value.key}
            onChange={(event) =>
              onChange({ ...value, key: event.target.value })
            }
          />
          {takesValue && (
            <Input
              aria-label="Value"
              className={className}
              placeholder={field?.placeholderValue ?? 'Value...'}
              value={value.text}
              onChange={(event) =>
                onChange({ ...value, text: event.target.value })
              }
            />
          )}
        </>
      );
    case 'list':
      // Items are kept as typed, blanks included, so a trailing comma stays
      // in the box; the query drops the blanks.
      return (
        <Input
          aria-label="Values"
          className={className}
          placeholder={field?.placeholder ?? 'One, two, three...'}
          value={value.items.join(',')}
          onChange={(event) =>
            onChange({ kind: 'list', items: event.target.value.split(',') })
          }
        />
      );
    case 'text': {
      if (!takesValue) {
        return null;
      }

      const options =
        field?.variant === 'boolean'
          ? [
              { label: 'True', value: 'true' },
              { label: 'False', value: 'false' },
            ]
          : field?.options;

      return options ? (
        <Select
          value={value.text}
          onValueChange={(text) => onChange({ kind: 'text', text })}
        >
          <SelectTrigger aria-label="Value" className={className}>
            <SelectValue placeholder={field?.placeholder ?? 'Pick a value'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          aria-label="Value"
          className={className}
          inputMode={field?.variant === 'number' ? 'numeric' : undefined}
          placeholder={field?.placeholder ?? 'Value...'}
          value={value.text}
          onChange={(event) =>
            onChange({ kind: 'text', text: event.target.value })
          }
        />
      );
    }
  }
}

/**
 * A range of whole days. The first day counts from its start and the last to
 * its end, so a one-day pick holds that whole day.
 */
function FilterRangeInput({
  value,
  onChange,
  className,
}: {
  value: Extract<TFilterValue, { kind: 'instants' }>;
  onChange: (value: TFilterValue) => void;
  className?: string;
}) {
  const selected: DateRange | undefined =
    value.from && value.to
      ? { from: new Date(value.from), to: new Date(value.to) }
      : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          caseSensitive
          className={cn(
            'justify-start gap-2 font-sans font-normal',
            !selected && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="size-4 shrink-0" />
          <span className="truncate">
            {selected?.from && selected.to
              ? `${DAY_FORMAT.format(selected.from)} – ${DAY_FORMAT.format(selected.to)}`
              : 'Pick a range of days'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={selected}
          onSelect={(range) => {
            if (!range?.from) {
              onChange({ kind: 'instants', from: '', to: '' });

              return;
            }

            const from = new Date(range.from);
            const to = new Date(range.to ?? range.from);
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);
            onChange({
              kind: 'instants',
              from: from.toISOString(),
              to: to.toISOString(),
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { FilterBuilder, FilterValueInput, type TFilterBuilderProps };
