'use client';

import { ChevronDown, ListPlus, Plus, X } from 'lucide-react';
import * as React from 'react';

import { FilterValueInput } from '@/components/ui-fragments/filter-builder/filter-builder';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';

// The filter, always on screen above a table: the same tree as the
// `FilterBuilder`, drawn inline. A condition is one chip of segments (field,
// operator, value, remove); a group is a framed run of chips; between two
// children of a group sits its join, and a click on it switches the whole
// group between `and` and `or`. A group left empty is removed with it.

type TFilterBarProps = {
  /** The resource's vocabulary. A platform `FilterConfig` fits as it is. */
  fields: TFilterFields;
  /** The root group. Start from `createFilterGroup()` or `filterOfQuery()`. */
  value: TFilterGroup;
  onChange: (value: TFilterGroup) => void;
  /** How many levels of groups the reader can open. `1` hides groups. */
  maxDepth?: number;
  /** The toolbar's other controls, after Clear in the same row: Raw body query. */
  actions?: React.ReactNode;
  className?: string;
};

type TBarScope = {
  fields: TFilterFields;
  depth: number;
  maxDepth: number;
};

/** A control drawn as one segment of a chip: no frame of its own. */
const SEGMENT =
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

  return (
    <div
      data-slot="filter-bar"
      className={cn('flex flex-wrap items-center gap-1.5', className)}
    >
      <FilterBarNodes group={value} onChange={onChange} scope={scope} />
      <FilterBarAdd
        group={value}
        scope={scope}
        onAdd={(node) =>
          onChange({ ...value, children: [...value.children, node] })
        }
      >
        <Button
          type="button"
          variant="outlineDashed"
          size="md"
          className="gap-1.5"
        >
          <Plus className="size-3.5" />
          Add filter
        </Button>
      </FilterBarAdd>
      {value.children.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => onChange(createFilterGroup(value.join))}
        >
          Clear
        </Button>
      )}
      {actions}
    </div>
  );
}

/** A group's children, with its join between each two. */
function FilterBarNodes({
  group,
  onChange,
  scope,
}: {
  group: TFilterGroup;
  onChange: (group: TFilterGroup) => void;
  scope: TBarScope;
}) {
  const otherJoin: TFilterJoin = group.join === 'and' ? 'or' : 'and';

  return group.children.map((node, index) => {
    const replace = (next: TFilterNode | null) =>
      onChange({
        ...group,
        children:
          next === null || (next.kind === 'group' && next.children.length === 0)
            ? group.children.filter((one) => one !== node)
            : group.children.map((one) => (one === node ? next : one)),
      });

    return (
      <React.Fragment key={node.id}>
        {index > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            caseSensitive
            title={`Join this group with ${otherJoin}`}
            className="text-muted-foreground h-8 px-1.5 text-xs"
            onClick={() => onChange({ ...group, join: otherJoin })}
          >
            {group.join}
          </Button>
        )}
        {node.kind === 'condition' ? (
          <FilterChip
            condition={node}
            fields={scope.fields}
            onChange={replace}
            onRemove={() => replace(null)}
          />
        ) : (
          <div
            data-slot="filter-group"
            className="bg-muted/40 inline-flex flex-wrap items-center gap-1.5 rounded-md border border-dashed p-1"
          >
            <FilterBarNodes
              group={node}
              onChange={replace}
              scope={{ ...scope, depth: scope.depth + 1 }}
            />
            <span className="inline-flex">
              <FilterBarAdd
                group={node}
                scope={{ ...scope, depth: scope.depth + 1 }}
                onAdd={(child) =>
                  replace({ ...node, children: [...node.children, child] })
                }
              >
                <Button type="button" variant="ghost" size="icon-md">
                  <Plus />
                  <span className="sr-only">Add to group</span>
                </Button>
              </FilterBarAdd>
              <Button
                type="button"
                variant="ghost"
                size="icon-md"
                onClick={() => replace(null)}
              >
                <X />
                <span className="sr-only">Remove group</span>
              </Button>
            </span>
          </div>
        )}
      </React.Fragment>
    );
  });
}

/**
 * The menu that adds to a group: a condition on the field picked, or, while
 * the depth allows, a group of the other join with one condition in it.
 */
function FilterBarAdd({
  group,
  scope,
  onAdd,
  children,
}: {
  group: TFilterGroup;
  scope: TBarScope;
  onAdd: (node: TFilterNode) => void;
  children: React.ReactNode;
}) {
  const canNest = scope.depth < scope.maxDepth;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {Object.entries(scope.fields).map(([key, field]) => (
          <DropdownMenuItem
            key={key}
            onSelect={() => onAdd(createFilterCondition(scope.fields, key))}
          >
            {field.label}
          </DropdownMenuItem>
        ))}
        {canNest && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() =>
                onAdd(
                  createFilterGroup(group.join === 'and' ? 'or' : 'and', [
                    createFilterCondition(scope.fields),
                  ])
                )
              }
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
  const field = fields[condition.field];
  const operators = field ? filterOperators(field) : [];

  return (
    <div
      data-slot="filter-chip"
      className="bg-background inline-flex h-8 max-w-full items-stretch divide-x overflow-hidden rounded-md border text-sm"
    >
      <Select
        value={condition.field}
        onValueChange={(next) =>
          onChange({ ...createFilterCondition(fields, next), id: condition.id })
        }
      >
        <SelectTrigger
          aria-label="Field"
          className={cn(SEGMENT, 'gap-1 font-mono text-xs uppercase')}
          icon={<ChevronDown className="size-3 opacity-50" />}
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
        <SelectTrigger
          aria-label="Operator"
          className={cn(SEGMENT, 'text-muted-foreground gap-1')}
          icon={<ChevronDown className="size-3 opacity-50" />}
        >
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
        className={cn(SEGMENT, 'field-sizing-content max-w-56 min-w-12')}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-full rounded-none"
        onClick={onRemove}
      >
        <X />
        <span className="sr-only">Remove filter</span>
      </Button>
    </div>
  );
}

export { FilterBar, type TFilterBarProps };
