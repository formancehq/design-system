'use client';

import { CalendarIcon, ListPlus } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import {
  createFilterCondition,
  createFilterSubgroup,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { Input } from '@/registry/default/ui/input';
import {
  Popover,
  PopoverAnchor,
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

// The parts both layouts draw a condition with: the `FilterBuilder` as rows,
// the `FilterBar` as chips. Each layout gives them its own class names.

/**
 * What the reader is typing in one input of a condition, given to a consumer
 * that offers values for it.
 */
type TFilterSuggestionRequest = {
  condition: TFilterCondition;
  /** The input: a keyed value's key, or the value. */
  part: 'key' | 'value';
  /** What the input holds now. */
  text: string;
  /** Writes a text into that input and closes the offers. */
  pick: (text: string) => void;
};

/** One value an input offers: what it writes, how it reads, how many hold it. */
type TFilterSuggestion = { value: string; label?: string; count?: number };

type TFilterEditorProps = {
  /** The resource's vocabulary. A platform `FilterConfig` fits as it is. */
  fields: TFilterFields;
  /** The root group. Start from `createFilterGroup()` or `filterOfQuery()`. */
  value: TFilterGroup;
  onChange: (value: TFilterGroup) => void;
  /**
   * How many levels of groups the reader can open. `1` is a flat list with
   * one join, as the data table's filters are today; `2` holds an `$or` of
   * `$and`s.
   */
  maxDepth?: number;
  /**
   * What a value or key input offers while it has focus, drawn under it:
   * usually a `FilterSuggestionList`. It is mounted only while the input has
   * focus, so what it reads is read only then. `null` offers nothing.
   */
  suggestions?: (request: TFilterSuggestionRequest) => React.ReactNode;
  /**
   * The group marked as the target, for a surface that writes into one group
   * of the tree (a filter panel). The root is a group too.
   */
  activeGroupId?: string;
  /** A press inside a group makes it the target: the innermost group. */
  onActiveGroupChange?: (groupId: string) => void;
  className?: string;
};

/** Where a group sits in the tree, given to each level as it is drawn. */
type TFilterScope = Pick<
  TFilterEditorProps,
  'suggestions' | 'activeGroupId' | 'onActiveGroupChange'
> & {
  fields: TFilterFields;
  depth: number;
  maxDepth: number;
};

const DAY_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const COUNT_FORMAT = new Intl.NumberFormat('en-US');

/** Presses a group already took: the innermost group a press reaches. */
const TARGETED_PRESSES = new WeakSet<Event>();

/**
 * What makes a group the target of a press inside it, when the surface asks
 * for a target. A press bubbles from the innermost group out, through React
 * portals too (a select opened from a chip), so the first group it reaches
 * takes it and the groups around it let it pass.
 */
function groupTargetProps(
  groupId: string,
  scope: TFilterScope
): React.HTMLAttributes<HTMLDivElement> & { 'data-active'?: boolean } {
  const { onActiveGroupChange } = scope;

  if (!onActiveGroupChange) {
    return {};
  }

  return {
    'data-active': scope.activeGroupId === groupId,
    onPointerDown: (event) => {
      if (TARGETED_PRESSES.has(event.nativeEvent)) {
        return;
      }

      TARGETED_PRESSES.add(event.nativeEvent);
      onActiveGroupChange(groupId);
    },
  };
}

/** The frame of the target group: solid, in the primary color. */
const ACTIVE_GROUP =
  'data-[active=true]:border-solid data-[active=true]:border-primary';

/**
 * **The one way to add to a group**, in both layouts: the trigger (Add filter)
 * opens the fields, and a condition starts on the field picked. When
 * `canNest`, **Group** is the last item: a group of the other join with one
 * condition in it. A group is one more thing to add, not a second button.
 */
function FilterAddMenu({
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
  /** The trigger. */
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

/** The field, then the operator. A new field starts a new condition. */
function FilterConditionSelects({
  condition,
  fields,
  onChange,
  fieldClassName,
  operatorClassName,
}: {
  condition: TFilterCondition;
  fields: TFilterFields;
  onChange: (condition: TFilterCondition) => void;
  fieldClassName?: string;
  operatorClassName?: string;
}) {
  const field = fields[condition.field];
  const operators = field ? filterOperators(field) : [];

  return (
    <>
      <Select
        value={condition.field}
        onValueChange={(next) =>
          onChange({ ...createFilterCondition(fields, next), id: condition.id })
        }
      >
        <SelectTrigger
          aria-label="Field"
          className={cn('font-mono text-xs uppercase', fieldClassName)}
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
        <SelectTrigger aria-label="Operator" className={operatorClassName}>
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
    </>
  );
}

function FilterValueInput({
  condition,
  fields,
  onChange,
  suggestions,
  className,
}: {
  condition: TFilterCondition;
  fields: TFilterFields;
  onChange: (value: TFilterValue) => void;
  suggestions?: TFilterEditorProps['suggestions'];
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
          <SuggestedInput
            aria-label="Key"
            className={className}
            placeholder={field?.placeholderKey ?? 'Key...'}
            text={value.key}
            onText={(key) => onChange({ ...value, key })}
            offers={
              suggestions &&
              ((text, pick) =>
                suggestions({ condition, part: 'key', text, pick }))
            }
          />
          {takesValue && (
            <SuggestedInput
              aria-label="Value"
              className={className}
              placeholder={field?.placeholderValue ?? 'Value...'}
              text={value.text}
              onText={(text) => onChange({ ...value, text })}
              offers={
                suggestions &&
                ((text, pick) =>
                  suggestions({ condition, part: 'value', text, pick }))
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
        <SuggestedInput
          aria-label="Value"
          className={className}
          inputMode={field?.variant === 'number' ? 'numeric' : undefined}
          placeholder={field?.placeholder ?? 'Value...'}
          text={value.text}
          onText={(text) => onChange({ kind: 'text', text })}
          offers={
            suggestions &&
            ((text, pick) =>
              suggestions({ condition, part: 'value', text, pick }))
          }
        />
      );
    }
  }
}

/**
 * An input that offers values under it while it has focus. The offers are
 * mounted only while it is open. ArrowDown moves into them, and a pick writes
 * the value and gives the focus back to the input.
 */
function SuggestedInput({
  text,
  onText,
  offers,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> & {
  text: string;
  onText: (text: string) => void;
  offers?: (text: string, pick: (text: string) => void) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const generatedId = React.useId();
  const inputId = props.id ?? generatedId;
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  if (!offers) {
    return (
      <Input
        {...props}
        value={text}
        onChange={(event) => onText(event.target.value)}
      />
    );
  }

  const pick = (picked: string) => {
    onText(picked);
    document.getElementById(inputId)?.focus();
    setIsOpen(false);
  };
  const isInside = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.id === inputId || contentRef.current?.contains(target));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <Input
          {...props}
          id={inputId}
          autoComplete="off"
          value={text}
          onChange={(event) => {
            onText(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={(event) => {
            if (!isInside(event.relatedTarget)) {
              setIsOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setIsOpen(true);
              contentRef.current
                ?.querySelector<HTMLElement>('[data-slot=filter-suggestion]')
                ?.focus();
            }
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        ref={contentRef}
        align="start"
        className="w-64 p-1 empty:hidden"
        // The input keeps the focus: the offers follow what is typed.
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={(event) => {
          if (isInside(event.target)) {
            event.preventDefault();
          }
        }}
        onBlur={(event) => {
          if (!isInside(event.relatedTarget)) {
            setIsOpen(false);
          }
        }}
      >
        {isOpen && offers(text, pick)}
      </PopoverContent>
    </Popover>
  );
}

/**
 * The values an input offers, each with how many rows hold it when that is
 * known. Draws nothing when there is nothing to offer. ArrowUp and ArrowDown
 * move between the values.
 */
function FilterSuggestionList({
  items,
  onPick,
}: {
  items: readonly TFilterSuggestion[];
  onPick: (value: string) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  const move = (event: React.KeyboardEvent<HTMLElement>, step: 1 | -1) => {
    const all = [
      ...(event.currentTarget.parentElement?.querySelectorAll<HTMLElement>(
        '[data-slot=filter-suggestion]'
      ) ?? []),
    ];
    const next = all[all.indexOf(event.target as HTMLElement) + step];

    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  return (
    <div
      role="listbox"
      aria-label="Suggestions"
      className="flex max-h-64 flex-col overflow-y-auto"
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') {
          move(event, 1);
        }

        if (event.key === 'ArrowUp') {
          move(event, -1);
        }
      }}
    >
      {items.map((item) => (
        <Button
          key={item.value}
          type="button"
          role="option"
          aria-selected={false}
          variant="ghost"
          caseSensitive
          data-slot="filter-suggestion"
          className="w-full shrink-0 justify-between gap-3 font-sans font-normal"
          // A press must not take the focus from the input before the click.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onPick(item.value)}
        >
          <span className="truncate">{item.label ?? item.value}</span>
          {item.count !== undefined && (
            <span className="text-muted-foreground font-mono text-xs tabular-nums">
              {COUNT_FORMAT.format(item.count)}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
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

export {
  ACTIVE_GROUP,
  FilterAddMenu,
  FilterConditionSelects,
  FilterSuggestionList,
  FilterValueInput,
  groupTargetProps,
  type TFilterEditorProps,
  type TFilterScope,
  type TFilterSuggestion,
  type TFilterSuggestionRequest,
};
