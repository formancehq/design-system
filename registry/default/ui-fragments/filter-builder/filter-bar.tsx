'use client';

import { ArrowLeftRight, GripVertical, Plus, Trash2, X } from 'lucide-react';
import * as React from 'react';

import {
  ACTIVE_GROUP,
  FilterAddMenu,
  FilterConditionSelects,
  FilterValueInput,
  groupTargetProps,
  type TFilterEditorProps,
  type TFilterScope,
} from '@/components/ui-fragments/filter-builder/filter-parts';
import {
  createFilterGroup,
  withFilterValue,
  type TFilterCondition,
  type TFilterGroup,
  type TFilterJoin,
  type TFilterNode,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from '@/registry/default/ui/sortable';

// The filter, always on screen above a table: the same tree as the
// `FilterBuilder`, drawn inline. A condition is one chip of segments (field,
// operator, value, remove); a group is a framed run of chips; between two
// children of a group sits its join, an outlined pill with a swap icon, and a
// click on it switches the whole group between `and` and `or`. A group left
// empty is removed with it.

type TFilterBarProps = TFilterEditorProps & {
  /** The toolbar's other controls, after Reset in the same row: Inspect query. */
  actions?: React.ReactNode;
};

/** A control drawn as one segment of a chip: no frame of its own. */
const CHIP_SEGMENT =
  'h-full w-auto rounded-none border-0 bg-transparent px-2 shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 dark:bg-transparent dark:hover:bg-muted/50 hover:bg-muted';

function FilterBar({
  fields,
  unavailableFields,
  value,
  onChange,
  maxDepth = 2,
  suggestions,
  activeGroupId,
  onActiveGroupChange,
  timeZone = 'UTC',
  actions,
  className,
}: TFilterBarProps) {
  const scope = {
    fields,
    unavailableFields,
    depth: 1,
    maxDepth,
    suggestions,
    activeGroupId,
    onActiveGroupChange,
    timeZone,
  };
  const add = (node: TFilterNode) =>
    onChange({ ...value, children: [...value.children, node] });

  return (
    <div
      data-slot="filter-bar"
      {...groupTargetProps(value.id, scope)}
      className={cn(
        'flex flex-wrap items-center gap-1.5',
        // With a target to mark, the root is a group frame like the others.
        onActiveGroupChange && [
          'rounded-md border border-dashed p-1',
          ACTIVE_GROUP,
        ],
        className
      )}
    >
      <FilterBarNodes group={value} onChange={onChange} scope={scope} />
      <FilterAddMenu
        fields={fields}
        unavailable={unavailableFields}
        canNest={maxDepth > 1}
        join={value.join}
        onAdd={add}
      >
        <Button type="button" variant="outlineDashed" className="gap-2">
          <Plus className="size-4" />
          Add filter
        </Button>
      </FilterAddMenu>
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
                  variant="outline"
                  caseSensitive
                  title={`Switch this group to ${otherJoin}`}
                  className="text-muted-foreground hover:text-foreground h-6 gap-1 rounded-full px-2 text-xs"
                  onClick={() => onChange({ ...group, join: otherJoin })}
                >
                  {group.join}
                  <ArrowLeftRight className="size-3" />
                </Button>
              )}
              <SortableItem value={node.id} className="inline-flex max-w-full">
                {node.kind === 'condition' ? (
                  <FilterChip
                    condition={node}
                    scope={scope}
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
      {...groupTargetProps(group.id, scope)}
      className={cn(
        'bg-muted/40 inline-flex flex-wrap items-center gap-1.5 rounded-md border border-dashed p-1',
        ACTIVE_GROUP
      )}
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
        <FilterAddMenu
          fields={scope.fields}
          unavailable={scope.unavailableFields}
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
        </FilterAddMenu>
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

function FilterChip({
  condition,
  scope,
  onChange,
  onRemove,
}: {
  condition: TFilterCondition;
  scope: TFilterScope;
  onChange: (condition: TFilterCondition) => void;
  onRemove: () => void;
}) {
  return (
    <div
      data-slot="filter-chip"
      // The dividers are drawn by the chip, not by `divide-x`: its rule has no
      // specificity, so the segments' `border-0` erased it.
      className="bg-background inline-flex h-8 max-w-full items-stretch overflow-hidden rounded-md border text-sm [&>*:not(:last-child)]:border-r"
    >
      <FilterConditionSelects
        condition={condition}
        fields={scope.fields}
        onChange={onChange}
        fieldClassName={cn(CHIP_SEGMENT, 'gap-1')}
        operatorClassName={cn(CHIP_SEGMENT, 'gap-1')}
      />
      <FilterValueInput
        condition={condition}
        fields={scope.fields}
        suggestions={scope.suggestions}
        timeZone={scope.timeZone}
        onChange={(value) =>
          onChange(withFilterValue(condition, value, scope.fields))
        }
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
