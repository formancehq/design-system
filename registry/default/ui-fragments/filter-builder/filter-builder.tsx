'use client';

import { GripVertical, ListPlus, Plus, Trash2, X } from 'lucide-react';
import * as React from 'react';

import {
  ACTIVE_GROUP,
  FilterConditionSelects,
  FilterValueInput,
  groupTargetProps,
  type TFilterEditorProps,
  type TFilterScope,
} from '@/components/ui-fragments/filter-builder/filter-parts';
import {
  createFilterCondition,
  createFilterGroup,
  createFilterSubgroup,
  type TFilterGroup,
  type TFilterJoin,
  type TFilterNode,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
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
// its parent's row. It fits a popover; the `FilterBar` draws the same tree
// inline. The pure model lives in `filter-query.ts`.

function FilterBuilder({
  fields,
  value,
  onChange,
  maxDepth = 2,
  suggestions,
  activeGroupId,
  onActiveGroupChange,
  className,
}: TFilterEditorProps) {
  const scope = {
    fields,
    depth: 1,
    maxDepth,
    suggestions,
    activeGroupId,
    onActiveGroupChange,
  };

  return (
    <div
      data-slot="filter-builder"
      {...groupTargetProps(value.id, scope)}
      className={cn(
        'flex flex-col gap-3',
        // With a target to mark, the root is a group frame like the others.
        onActiveGroupChange && [
          'rounded-md border border-dashed p-2',
          ACTIVE_GROUP,
        ],
        className
      )}
    >
      <FilterGroupBody
        group={value}
        onChange={onChange}
        scope={scope}
        footer={
          value.children.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              className="gap-2"
              onClick={() => onChange(createFilterGroup(value.join))}
            >
              Reset
              <X className="size-4" />
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
  scope: TFilterScope;
  footer?: React.ReactNode;
}) {
  const setChildren = (children: readonly TFilterNode[]) =>
    onChange({ ...group, children });
  const isRoot = scope.depth === 1;
  const canNest = scope.depth < scope.maxDepth;

  return (
    <div className="flex flex-col gap-2">
      {group.children.length === 0 ? (
        <p className="text-muted-foreground px-1 text-sm">
          {isRoot
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
          variant={isRoot ? 'primary' : 'outline'}
          className="gap-2"
          onClick={() =>
            setChildren([
              ...group.children,
              createFilterCondition(scope.fields),
            ])
          }
        >
          <Plus className="size-4" />
          Add filter
        </Button>
        {canNest && (
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() =>
              setChildren([
                ...group.children,
                createFilterSubgroup(scope.fields, group.join),
              ])
            }
          >
            <ListPlus className="size-4" />
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
  scope: TFilterScope;
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
          {...groupTargetProps(node.id, scope)}
          className={cn(
            'bg-muted/40 min-w-0 flex-1 rounded-md border border-dashed p-2',
            ACTIVE_GROUP
          )}
        >
          <FilterGroupBody
            group={node}
            onChange={onChange}
            scope={{ ...scope, depth: scope.depth + 1 }}
            footer={
              <div className="ml-auto flex gap-2">
                <FilterRowActions label="Remove group" onRemove={onRemove} />
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
      <div
        data-slot="filter-condition"
        className="flex min-w-0 flex-1 items-start gap-2"
      >
        <FilterConditionSelects
          condition={node}
          fields={scope.fields}
          onChange={onChange}
          fieldClassName="w-32 shrink-0"
          operatorClassName="w-32 shrink-0"
        />
        <FilterValueInput
          condition={node}
          fields={scope.fields}
          suggestions={scope.suggestions}
          onChange={(value) => onChange({ ...node, value })}
          className="min-w-0 flex-1"
        />
      </div>
      <FilterRowActions label="Remove filter" onRemove={onRemove} />
    </SortableItem>
  );
}

/** Remove, then the drag handle. Rendered inside its row's `SortableItem`. */
function FilterRowActions({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon-md"
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
          size="icon-md"
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

export { FilterBuilder };
