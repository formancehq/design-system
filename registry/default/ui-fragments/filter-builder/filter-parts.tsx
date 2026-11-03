'use client';

import { CalendarIcon, Check, ChevronsUpDown, ListPlus } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import {
  createFilterCondition,
  createFilterSubgroup,
  filterConditionLabel,
  filterConditionOperators,
  filterDayMicros,
  filterDayOf,
  filterDayOfPick,
  filterDayRange,
  filterKeyType,
  filterPickOfDay,
  filterValueFor,
  withFilterValue,
  type TFilterCondition,
  type TFilterFields,
  type TFilterGroup,
  type TFilterJoin,
  type TFilterNode,
  type TFilterOperator,
  type TFilterValue,
} from '@/components/ui-fragments/filter-builder/filter-query';
import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
import { Calendar } from '@/registry/default/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/registry/default/ui/command';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';

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

/** A field the reader cannot add now, and why. */
type TFilterUnavailableField = { label: string; reason: string };

type TFilterEditorProps = {
  /** The resource's vocabulary: its fields, by field id. */
  fields: TFilterFields;
  /** The root group. Start from `createFilterGroup()` or `filterOfQuery()`. */
  value: TFilterGroup;
  onChange: (value: TFilterGroup) => void;
  /**
   * The fields of the vocabulary the reader cannot add now, by field id. Add
   * filter lists them after the others, disabled, with the reason on hover.
   */
  unavailableFields?: Readonly<Record<string, TFilterUnavailableField>>;
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
  /**
   * The time zone a picked day is read in (an IANA name): the instants it
   * writes, the day the calendar marks and the days a range shows. `UTC` by
   * default; never the browser's zone.
   */
  timeZone?: string;
  className?: string;
};

/** Where a group sits in the tree, given to each level as it is drawn. */
type TFilterScope = Pick<
  TFilterEditorProps,
  'suggestions' | 'activeGroupId' | 'onActiveGroupChange' | 'unavailableFields'
> & {
  fields: TFilterFields;
  depth: number;
  maxDepth: number;
  timeZone: string;
};

const DAY_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

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

/**
 * The frame of the target group: solid, in the foreground at low opacity, as a
 * checked card's. Not `border-primary`: the dark theme's primary is its border
 * color, so the mark was gone there, and in the light theme it was too heavy.
 */
const ACTIVE_GROUP =
  'data-[active=true]:border-solid data-[active=true]:border-foreground/30';

/**
 * **The one way to add to a group**, in both layouts: the trigger (Add filter)
 * opens the fields, and a condition starts on the field picked. A field the
 * reader cannot add follows them, disabled, with its reason on hover. When
 * `canNest`, **Group** is the last item: a group of the other join with one
 * condition in it. A group is one more thing to add, not a second button.
 */
function FilterAddMenu({
  fields,
  unavailable = {},
  canNest,
  join,
  onAdd,
  children,
}: {
  fields: TFilterFields;
  unavailable?: TFilterEditorProps['unavailableFields'];
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
        {Object.entries(unavailable)
          // A field already in the vocabulary is offered above.
          .filter(([key]) => !(key in fields))
          .map(([key, { label, reason }]) => (
            <Tooltip key={key}>
              {/* A disabled item takes no pointer events: the span holds the hover. */}
              <TooltipTrigger asChild>
                <span className="block">
                  <DropdownMenuItem disabled data-field={key}>
                    {label}
                  </DropdownMenuItem>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-64">
                {reason}
              </TooltipContent>
            </Tooltip>
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

/**
 * The field: a searchable list. A field list can be long, so the reader types
 * to find one. A new field starts a new condition.
 */
function FilterFieldPicker({
  condition,
  fields,
  onChange,
  className,
}: {
  condition: TFilterCondition;
  fields: TFilterFields;
  onChange: (condition: TFilterCondition) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-label="Field"
          aria-expanded={open}
          className={cn('justify-between gap-2 px-3 font-normal', className)}
        >
          <span className="truncate">
            {filterConditionLabel(condition, fields) ?? 'Select field'}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        {/* The keyboard starts on the current field. */}
        <Command defaultValue={fields[condition.field]?.label}>
          <CommandInput placeholder="Search fields..." />
          <CommandList>
            <CommandEmpty>No fields found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(fields).map(([key, one]) => (
                <CommandItem
                  key={key}
                  // The search reads the label the reader sees, and the id.
                  value={one.label}
                  keywords={[key]}
                  onSelect={() => {
                    if (key !== condition.field) {
                      onChange({
                        ...createFilterCondition(fields, key),
                        id: condition.id,
                      });
                    }
                    setOpen(false);
                  }}
                >
                  <span className="truncate">{one.label}</span>
                  <Check
                    className={cn(
                      'ml-auto',
                      key === condition.field ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** The field, then the operator. */
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
  const operators = filterConditionOperators(condition, fields);

  return (
    <>
      <FilterFieldPicker
        condition={condition}
        fields={fields}
        onChange={onChange}
        className={fieldClassName}
      />
      <Select
        value={condition.operator}
        onValueChange={(next) => {
          const operator = operators.find((one) => one.value === next)?.value;

          if (operator) {
            onChange(
              withFilterValue(
                { ...condition, operator },
                filterValueFor(field, operator, condition.value),
                fields
              )
            );
          }
        }}
      >
        <SelectTrigger
          aria-label="Operator"
          className={cn('lowercase', operatorClassName)}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operators.map((one) => (
            <SelectItem key={one.value} value={one.value} className="lowercase">
              {one.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

type TFilterValueInputProps = {
  condition: TFilterCondition;
  fields: TFilterFields;
  onChange: (value: TFilterValue) => void;
  suggestions?: TFilterEditorProps['suggestions'];
  /** The time zone a picked day is read in. */
  timeZone: string;
  /** Given to each control the value takes: one, or two for a keyed value. */
  className?: string;
};

const takesValue = (condition: TFilterCondition) =>
  condition.operator !== 'isEmpty' && condition.operator !== 'isNotEmpty';

function FilterValueInput(props: TFilterValueInputProps) {
  const { value } = props.condition;

  switch (value.kind) {
    case 'instants':
      return (
        <FilterRangeInput
          value={value}
          onChange={props.onChange}
          timeZone={props.timeZone}
          className={props.className}
        />
      );
    case 'keyed':
      return <FilterKeyedInput {...props} value={value} />;
    case 'list':
      return <FilterListInput {...props} value={value} />;
    case 'text':
      return takesValue(props.condition) ? (
        <FilterTextInput {...props} value={value} />
      ) : null;
  }
}

/**
 * A key, then its value unless the operator takes none. A field fixed on one
 * key (a key that the field list names) asks no key: its label names it. On
 * the metadata field with no key, only a new condition asks one: a key read
 * from a query is in the label (`Metadata · <key>`).
 *
 * A key whose type the consumer knows takes its value in that type: `true` or
 * `false`, a number, or a day.
 */
function FilterKeyedInput({
  condition,
  fields,
  onChange,
  suggestions,
  timeZone,
  className,
  value,
}: TFilterValueInputProps & {
  value: Extract<TFilterValue, { kind: 'keyed' }>;
}) {
  const field = fields[condition.field];
  const asksKey =
    field?.key === undefined &&
    (field?.variant !== 'metadata' ||
      value.asksKey === true ||
      value.key.trim() === '');
  const format = filterKeyType(field, value.key)?.format ?? 'string';
  const onText = (text: string) => onChange({ ...value, text });

  return (
    <>
      {asksKey && (
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
      )}
      {takesValue(condition) &&
        (format === 'bool' ? (
          <Select value={value.text} onValueChange={onText}>
            <SelectTrigger aria-label="Value" className={className}>
              <SelectValue placeholder="Pick a value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        ) : format === 'unixMicros' ? (
          <FilterDayInput
            micros={value.text}
            operator={condition.operator}
            onMicros={onText}
            timeZone={timeZone}
            className={className}
          />
        ) : (
          <SuggestedInput
            aria-label="Value"
            className={className}
            inputMode={format === 'string' ? undefined : 'numeric'}
            placeholder={
              format === 'string'
                ? (field?.placeholderValue ?? 'Value...')
                : 'Number...'
            }
            text={value.text}
            onText={onText}
            offers={
              suggestions &&
              ((text, pick) =>
                suggestions({ condition, part: 'value', text, pick }))
            }
          />
        ))}
    </>
  );
}

/**
 * Items are kept as typed, blanks included, so a trailing comma stays in the
 * box; the query drops the blanks.
 */
function FilterListInput({
  condition,
  fields,
  onChange,
  className,
  value,
}: TFilterValueInputProps & {
  value: Extract<TFilterValue, { kind: 'list' }>;
}) {
  return (
    <Input
      aria-label="Values"
      className={className}
      placeholder={fields[condition.field]?.placeholder ?? 'One, two, three...'}
      value={value.items.join(',')}
      onChange={(event) =>
        onChange({ kind: 'list', items: event.target.value.split(',') })
      }
    />
  );
}

/** A choice when the field has options (a boolean has two), else a text box. */
function FilterTextInput({
  condition,
  fields,
  onChange,
  suggestions,
  className,
  value,
}: TFilterValueInputProps & {
  value: Extract<TFilterValue, { kind: 'text' }>;
}) {
  const field = fields[condition.field];
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
        ((text, pick) => suggestions({ condition, part: 'value', text, pick }))
      }
    />
  );
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
 * A range of whole days in the consumer's time zone. The first day counts
 * from its start and the last to its end, so a one-day pick holds that whole
 * day.
 */
function FilterRangeInput({
  value,
  onChange,
  timeZone,
  className,
}: {
  value: Extract<TFilterValue, { kind: 'instants' }>;
  onChange: (value: TFilterValue) => void;
  timeZone: string;
  className?: string;
}) {
  const from = new Date(value.from);
  const to = new Date(value.to);
  const isReadable =
    value.from !== '' &&
    value.to !== '' &&
    !Number.isNaN(from.getTime()) &&
    !Number.isNaN(to.getTime());
  const selected: DateRange | undefined = isReadable
    ? {
        from: filterPickOfDay(filterDayOf(from, timeZone)),
        to: filterPickOfDay(filterDayOf(to, timeZone)),
      }
    : undefined;
  const days = React.useMemo(
    () => new Intl.DateTimeFormat('en-US', { ...DAY_OPTIONS, timeZone }),
    [timeZone]
  );

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
            {isReadable
              ? `${days.format(from)} – ${days.format(to)}`
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
            onChange(
              range?.from
                ? filterDayRange(
                    filterDayOfPick(range.from),
                    filterDayOfPick(range.to ?? range.from),
                    timeZone
                  )
                : { kind: 'instants', from: '', to: '' }
            );
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * One day in the consumer's time zone, written as signed Unix microseconds (a
 * `datetime` metadata key). A bound that holds the day (`≥`, `≤`) or leaves
 * it out (`<`, `>`) takes the start or the end of the day, so a day picked is
 * a whole day.
 */
function FilterDayInput({
  micros,
  operator,
  onMicros,
  timeZone,
  className,
}: {
  micros: string;
  operator: TFilterOperator;
  onMicros: (micros: string) => void;
  timeZone: string;
  className?: string;
}) {
  const instant = /^-?\d+$/.test(micros.trim())
    ? new Date(Math.floor(Number(micros) / 1000))
    : undefined;
  const days = React.useMemo(
    () => new Intl.DateTimeFormat('en-US', { ...DAY_OPTIONS, timeZone }),
    [timeZone]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          caseSensitive
          aria-label="Value"
          className={cn(
            'justify-start gap-2 font-sans font-normal',
            !instant && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="size-4 shrink-0" />
          <span className="truncate">
            {instant ? days.format(instant) : 'Pick a day'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={instant && filterPickOfDay(filterDayOf(instant, timeZone))}
          onSelect={(day) => {
            onMicros(
              day
                ? filterDayMicros(filterDayOfPick(day), operator, timeZone)
                : ''
            );
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
