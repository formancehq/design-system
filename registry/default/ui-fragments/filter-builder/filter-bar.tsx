'use client';

import { GripVertical, ListPlus, Plus, Trash2, X } from 'lucide-react';
import * as React from 'react';

import {
  FilterConditionSelects,
  FilterValueInput,
  type TFilterEditorProps,
  type TFilterScope,
} from '@/components/ui-fragments/filter-builder/filter-parts';
import {
  createFilterCondition,
  createFilterGroup,
  createFilterSubgroup,
  type TFilterCondition,
  type TFilterFields,
  type TFilterGroup,
  type TFilterJoin,
  type TFilterNode,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from '@/registry/default/ui/sortable';

// The filter, always on screen above a table: the same tree as the
// `FilterBuilder`, drawn inline. A condition is one chip of segments (field,
// operator, value, remove); a group is a framed run of chips; between two
// children of a group sits its join, and a click on it switches the whole
// group between `and` and `or`. A group left empty is removed with it.

type TFilterBarProps = TFilterEditorProps & {
  /**
   * The toolbar's other controls, after Reset in the same row: Inspect query,
   * or a popover with the `FilterBuilder` for a tree too deep for one row.
   */
  actions?: React.ReactNode;
};

/** A control drawn as one segment of a chip: no frame of its own. */
const CHIP_SEGMENT =
  'h-full w-auto rounded-none border-0 bg-transparent px-2 shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 dark:bg-transparent dark:hover:bg-muted/50 hover:bg-muted';

function FilterBar({
  fields,
  value,
  onChange,
  maxDepth = 2,
  actions,
  className,
}: TFilterBarProps) {
  const scope = { fields, depth: 1, maxDepth };
  const add = (node: TFilterNode) =>
    onChange({ ...value, children: [...value.children, node] });

  return (
    <div
      data-slot="filter-bar"
      className={cn('flex flex-wrap items-center gap-1.5', className)}
    >
      <FilterBarNodes group={value} onChange={onChange} scope={scope} />
      <FilterBarAdd
        fields={fields}
        canNest={false}
        join={value.join}
        onAdd={add}
      >
        <Button type="button" variant="outlineDashed" className="gap-2">
          <Plus className="size-4" />
          Add filter
        </Button>
      </FilterBarAdd>
      {maxDepth > 1 && (
        // A button of its own, not an item under Add filter: a group is the
        // one thing the flat filters could not say, so it is never hidden.
        <Button
          type="button"
          variant="outlineDashed"
          className="gap-2"
          onClick={() => add(createFilterSubgroup(fields, value.join))}
        >
          <ListPlus className="size-4" />
          Add group
        </Button>
      )}
      {value.children.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={() => onChange(createFilterGroup(value.join))}
        >
          Reset
          <X className="size-4" />
        </Button>
      )}
      {actions}
    </div>
  );
}

/**
 * A group's children, with its join between each two. They are drawn straight
 * into the parent's row (`withoutSlot`), so the row wraps them, and a group is
 * dragged by its handle to another place among its siblings.
 */
function FilterBarNodes({
  group,
  onChange,
  scope,
}: {
  group: TFilterGroup;
  onChange: (group: TFilterGroup) => void;
  scope: TFilterScope;
}) {
  const otherJoin: TFilterJoin = group.join === 'and' ? 'or' : 'and';

  return (
    <Sortable
      value={[...group.children]}
      getItemValue={(node: TFilterNode) => node.id}
      onValueChange={(children) => onChange({ ...group, children })}
      orientation="mixed"
    >
      <SortableContent withoutSlot>
        {group.children.map((node, index) => {
          const replace = (next: TFilterNode | null) =>
            onChange({
              ...group,
              children:
                next === null ||
                (next.kind === 'group' && next.children.length === 0)
                  ? group.children.filter((one) => one !== node)
                  : group.children.map((one) => (one === node ? next : one)),
            });

          return (
            <React.Fragment key={node.id}>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  caseSensitive
                  title={`Join this group with ${otherJoin}`}
                  className="text-muted-foreground px-1.5 text-xs"
                  onClick={() => onChange({ ...group, join: otherJoin })}
                >
                  {group.join}
                </Button>
              )}
              <SortableItem value={node.id} className="inline-flex max-w-full">
                {node.kind === 'condition' ? (
                  <FilterChip
                    condition={node}
                    fields={scope.fields}
                    onChange={replace}
                    onRemove={() => replace(null)}
                  />
                ) : (
                  <FilterGroupFrame
                    group={node}
                    scope={scope}
                    onChange={replace}
                  />
                )}
              </SortableItem>
            </React.Fragment>
          );
        })}
      </SortableContent>
    </Sortable>
  );
}

/** A nested group: its handle, its chips, then add and remove. */
function FilterGroupFrame({
  group,
  scope,
  onChange,
}: {
  group: TFilterGroup;
  scope: TFilterScope;
  /** `null` removes the group. */
  onChange: (group: TFilterGroup | null) => void;
}) {
  return (
    <div
      data-slot="filter-group"
      className="bg-muted/40 inline-flex flex-wrap items-center gap-1.5 rounded-md border border-dashed p-1"
    >
      <SortableItemHandle asChild>
        <Button type="button" variant="outline" size="icon-md">
          <GripVertical className="text-muted-foreground" />
          <span className="sr-only">Drag to reorder</span>
        </Button>
      </SortableItemHandle>
      <FilterBarNodes
        group={group}
        onChange={onChange}
        scope={{ ...scope, depth: scope.depth + 1 }}
      />
      <span className="inline-flex gap-1.5">
        <FilterBarAdd
          fields={scope.fields}
          canNest={scope.depth + 1 < scope.maxDepth}
          join={group.join}
          onAdd={(child) =>
            onChange({ ...group, children: [...group.children, child] })
          }
        >
          <Button type="button" variant="outline" size="icon-md">
            <Plus />
            <span className="sr-only">Add to group</span>
          </Button>
        </FilterBarAdd>
        <Button
          type="button"
          variant="outline"
          size="icon-md"
          onClick={() => onChange(null)}
        >
          <Trash2 />
          <span className="sr-only">Remove group</span>
        </Button>
      </span>
    </div>
  );
}

/**
 * The menu that adds to a group: a condition on the field picked, or, when
 * `canNest`, a group of the other join with one condition in it.
 */
function FilterBarAdd({
  fields,
  canNest,
  join,
  onAdd,
  children,
}: {
  fields: TFilterFields;
  canNest: boolean;
  /** The join of the group added to. A new group takes the other one. */
  join: TFilterJoin;
  onAdd: (node: TFilterNode) => void;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {Object.entries(fields).map(([key, field]) => (
          <DropdownMenuItem
            key={key}
            onSelect={() => onAdd(createFilterCondition(fields, key))}
          >
            {field.label}
          </DropdownMenuItem>
        ))}
        {canNest && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => onAdd(createFilterSubgroup(fields, join))}
            >
              <ListPlus />
              Group
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterChip({
  condition,
  fields,
  onChange,
  onRemove,
}: {
  condition: TFilterCondition;
  fields: TFilterFields;
  onChange: (condition: TFilterCondition) => void;
  onRemove: () => void;
}) {
  return (
    <div
      data-slot="filter-chip"
      className="bg-background inline-flex h-8 max-w-full items-stretch divide-x overflow-hidden rounded-md border text-sm"
    >
      <FilterConditionSelects
        condition={condition}
        fields={fields}
        onChange={onChange}
        fieldClassName={cn(CHIP_SEGMENT, 'gap-1')}
        operatorClassName={cn(CHIP_SEGMENT, 'text-muted-foreground gap-1')}
      />
      <FilterValueInput
        condition={condition}
        fields={fields}
        onChange={(value) => onChange({ ...condition, value })}
        className={cn(CHIP_SEGMENT, 'field-sizing-content max-w-56 min-w-12')}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={CHIP_SEGMENT}
        onClick={onRemove}
      >
        <X />
        <span className="sr-only">Remove filter</span>
      </Button>
    </div>
  );
}

export { FilterBar, type TFilterBarProps };
