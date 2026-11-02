'use client';

import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import {
  createFilterCondition,
  filterOperators,
  filterValueFor,
  type TFilterCondition,
  type TFilterFields,
  type TFilterGroup,
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

// The parts both layouts draw a condition with: the `FilterBuilder` as rows,
// the `FilterBar` as chips. Each layout gives them its own class names.

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
  className?: string;
};

/** Where a group sits in the tree, given to each level as it is drawn. */
type TFilterScope = {
  fields: TFilterFields;
  depth: number;
  maxDepth: number;
};

const DAY_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

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

export {
  FilterConditionSelects,
  FilterValueInput,
  type TFilterEditorProps,
  type TFilterScope,
};
