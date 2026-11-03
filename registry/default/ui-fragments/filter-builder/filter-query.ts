export type TFilterJoin = 'and' | 'or';

/**
 * The operators and variants of a filter field, named as the console's filter
 * vocabulary names them, so that vocabulary is a `TFilterFields` as it is: no
 * adapter between the console's vocabulary and this builder.
 */
export type TFilterOperator =
  | 'eq'
  | 'ne'
  | 'like'
  | 'in'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'isBetween'
  | 'dateRange';

export type TFilterVariant =
  | 'text'
  | 'number'
  | 'date'
  | 'dateRange'
  | 'boolean'
  | 'select'
  | 'multiSelect'
  | 'metadata'
  | 'balanceByAsset'
  | 'slider';

export type TFilterOption = { label: string; value: string };

export type TFilterOperatorOption = { label: string; value: TFilterOperator };

/** One field of a resource's filter vocabulary: a `FilterFieldConfig`. */
export type TFilterField = {
  label: string;
  variant: TFilterVariant;
  /** The field's own operators. Without them, the variant's are offered. */
  operators?: readonly TFilterOperatorOption[];
  options?: readonly TFilterOption[];
  placeholder?: string;
  /** For a keyed variant (`metadata`, `balanceByAsset`): the key input. */
  placeholderKey?: string;
  /** For a keyed variant (`metadata`, `balanceByAsset`): the value input. */
  placeholderValue?: string;
  /**
   * For the `metadata` variant: the one key this field is fixed on
   * (`metadata[<key>]`, a key that the field list names). No key is asked.
   */
  key?: string;
  /**
   * For the `metadata` variant: what the consumer knows of each key, by key
   * (the declared type of a ledger's metadata key). A condition on a key
   * listed here offers that key's operators and value input; any other key
   * offers the field's.
   */
  keyTypes?: Readonly<Record<string, TFilterKeyType>>;
};

/** A resource's filter vocabulary, keyed by the path the ledger reads. */
export type TFilterFields = Record<string, TFilterField>;

/**
 * The JSON a key's value is written as: a string, a bool, a number, a decimal
 * string, or a number of signed Unix microseconds (a day, picked as a date).
 */
export type TFilterKeyFormat =
  'string' | 'bool' | 'number' | 'decimalString' | 'unixMicros';

/** One key of a keyed field: the operators it takes, the format of its value. */
export type TFilterKeyType = {
  operators: readonly TFilterOperatorOption[];
  format: TFilterKeyFormat;
};

/**
 * The JSON a metadata value is written as where its text alone does not say
 * it: a JSON bool (a `bool` key's Match) or a decimal string (an unsigned
 * key's bound). Without it, the variant decides: a string to match, a number
 * to bound.
 */
export type TFilterKeyedFormat = 'bool' | 'decimalString';

/**
 * What a condition compares its field with. The same four shapes as the
 * console's `TClauseValue`, so a condition maps onto one of its clauses.
 */
export type TFilterValue =
  /** One value, as text: a number or a boolean is written in the field's type. */
  | { kind: 'text'; text: string }
  /** A list, for `in` on a field that is not keyed. */
  | { kind: 'list'; items: readonly string[] }
  /** A value under a key the reader names: a metadata key, a balance's asset. */
  | {
      kind: 'keyed';
      key: string;
      text: string;
      format?: TFilterKeyedFormat;
      /**
       * The reader types the key: a new condition on the field with no key.
       * A key read from a query, or written by the filter panel, is not
       * typed again: the condition's label names it (`Metadata · <key>`).
       */
      asksKey?: true;
    }
  /** Two instants, both included, for a date range. */
  | { kind: 'instants'; from: string; to: string };

/** One comparison: a field, an operator and a value. */
export type TFilterCondition = {
  kind: 'condition';
  id: string;
  field: string;
  operator: TFilterOperator;
  value: TFilterValue;
};

/** Conditions and groups, joined by one `$and` or one `$or`. */
export type TFilterGroup = {
  kind: 'group';
  id: string;
  join: TFilterJoin;
  children: readonly TFilterNode[];
};

export type TFilterNode = TFilterCondition | TFilterGroup;

/** A ledger query document: `{ $and: [...] }`, `{ $match: { path: value } }`. */
export type TFilterQuery = Record<string, unknown>;

const VARIANT_OPERATORS: Record<TFilterVariant, TFilterOperatorOption[]> = {
  text: [
    { label: 'Match', value: 'eq' },
    { label: 'Is not', value: 'ne' },
    { label: 'Like', value: 'like' },
  ],
  number: [
    { label: 'Match', value: 'eq' },
    { label: 'Lower than', value: 'lt' },
    { label: 'Lower than equal', value: 'lte' },
    { label: 'Greater than', value: 'gt' },
    { label: 'Greater than equal', value: 'gte' },
  ],
  date: [{ label: 'Match', value: 'eq' }],
  dateRange: [{ label: 'Range', value: 'dateRange' }],
  boolean: [
    { label: 'Match', value: 'eq' },
    { label: 'Is not', value: 'ne' },
  ],
  select: [
    { label: 'Match', value: 'eq' },
    { label: 'Is not', value: 'ne' },
  ],
  multiSelect: [
    { label: 'Match', value: 'eq' },
    { label: 'Is not', value: 'ne' },
    { label: 'In', value: 'in' },
  ],
  metadata: [{ label: 'Match', value: 'eq' }],
  balanceByAsset: [
    { label: 'Match', value: 'eq' },
    { label: 'Lower than', value: 'lt' },
    { label: 'Lower than equal', value: 'lte' },
    { label: 'Greater than', value: 'gt' },
    { label: 'Greater than equal', value: 'gte' },
  ],
  slider: [{ label: 'Match', value: 'eq' }],
};

/** Every operator's name, for an operator a field does not list. */
const OPERATOR_LABELS: Record<TFilterOperator, string> = {
  eq: 'Match',
  ne: 'Is not',
  like: 'Like',
  in: 'Is any of',
  isEmpty: 'Is not set',
  isNotEmpty: 'Is set',
  lt: 'Lower than',
  lte: 'Lower than equal',
  gt: 'Greater than',
  gte: 'Greater than equal',
  isBetween: 'Between',
  dateRange: 'Range',
};

/**
 * What the consumer knows of one key of a metadata field, or `null`: a field
 * fixed on a key reads its own key, any other the key it is given.
 */
export function filterKeyType(
  field: TFilterField | undefined,
  key?: string
): TFilterKeyType | null {
  const name = field?.key ?? key?.trim();

  return field?.variant === 'metadata' &&
    field.keyTypes &&
    name !== undefined &&
    Object.hasOwn(field.keyTypes, name)
    ? field.keyTypes[name]!
    : null;
}

/**
 * The operators a field offers: those of its key where the consumer knows the
 * key's type, else the field's own, else its variant's.
 */
export const filterOperators = (
  field: TFilterField,
  key?: string
): readonly TFilterOperatorOption[] =>
  filterKeyType(field, key)?.operators ??
  field.operators ??
  VARIANT_OPERATORS[field.variant];

/**
 * The operators a condition offers: its field's, on its key. An operator the
 * list does not hold stays offered while the condition holds it, so a question
 * read from the raw editor is drawn as it is written and never rewritten. A
 * condition the reader is making (`asksKey`) on a key of a known type is
 * offered that type's operators only.
 */
export function filterConditionOperators(
  condition: TFilterCondition,
  fields: TFilterFields
): readonly TFilterOperatorOption[] {
  const field = fields[condition.field];

  if (!field) {
    return [];
  }

  const { value } = condition;
  const key = value.kind === 'keyed' ? value.key : undefined;
  const operators = filterOperators(field, key);
  const isTypedDraft =
    value.kind === 'keyed' &&
    value.asksKey === true &&
    filterKeyType(field, key) !== null;

  return isTypedDraft ||
    operators.some((one) => one.value === condition.operator)
    ? operators
    : [
        ...operators,
        {
          label:
            field.operators?.find((one) => one.value === condition.operator)
              ?.label ?? OPERATOR_LABELS[condition.operator],
          value: condition.operator,
        },
      ];
}

/**
 * The name a condition's field reads as: its label, and on the metadata field
 * with no key, the key once it is set (`Metadata · <key>`). A key the reader is
 * still typing is in its own input.
 */
export function filterConditionLabel(
  condition: TFilterCondition,
  fields: TFilterFields
): string | null {
  const field = fields[condition.field];
  const { value } = condition;

  if (!field) {
    return null;
  }

  return field.variant === 'metadata' &&
    field.key === undefined &&
    value.kind === 'keyed' &&
    !value.asksKey &&
    value.key.trim() !== ''
    ? `${field.label} · ${value.key.trim()}`
    : field.label;
}

const isKeyedVariant = (variant: TFilterVariant | undefined) =>
  variant === 'metadata' || variant === 'balanceByAsset';

/** The operators that compare nothing: they take no value. */
const takesNoValue = (operator: TFilterOperator) =>
  operator === 'isEmpty' || operator === 'isNotEmpty';

const isBound = (operator: TFilterOperator) =>
  operator === 'lt' ||
  operator === 'lte' ||
  operator === 'gt' ||
  operator === 'gte';

/**
 * The empty value an operator takes on a field. A value of the right shape
 * already typed is kept, so changing `eq` to `ne` does not clear it.
 */
export function filterValueFor(
  field: TFilterField | undefined,
  operator: TFilterOperator,
  current?: TFilterValue
): TFilterValue {
  const kind: TFilterValue['kind'] =
    field?.variant === 'dateRange'
      ? 'instants'
      : isKeyedVariant(field?.variant)
        ? 'keyed'
        : operator === 'in'
          ? 'list'
          : 'text';

  if (current?.kind === kind) {
    return current;
  }

  switch (kind) {
    case 'instants':
      return { kind, from: '', to: '' };
    case 'keyed':
      return field?.variant === 'metadata' && field.key === undefined
        ? { kind, key: '', text: '', asksKey: true }
        : { kind, key: field?.key ?? '', text: '' };
    case 'list':
      return { kind, items: [] };
    case 'text':
      return { kind, text: '' };
  }
}

/**
 * A condition with a value the reader changed. On a key whose type the
 * consumer knows, the operator is one the key takes (its first, where the one
 * held is not), and the value is written in the key's format: a JSON bool, or
 * an unsigned key's bound as a decimal string.
 */
export function withFilterValue(
  condition: TFilterCondition,
  value: TFilterValue,
  fields: TFilterFields
): TFilterCondition {
  const type =
    value.kind === 'keyed'
      ? filterKeyType(fields[condition.field], value.key)
      : null;

  if (!type || value.kind !== 'keyed') {
    return { ...condition, value };
  }

  const operator = type.operators.some(
    ({ value: one }) => one === condition.operator
  )
    ? condition.operator
    : (type.operators[0]?.value ?? condition.operator);
  const format: TFilterKeyedFormat | null =
    type.format === 'bool'
      ? 'bool'
      : type.format === 'decimalString' && isBound(operator)
        ? 'decimalString'
        : null;

  return {
    ...condition,
    operator,
    value: {
      kind: 'keyed',
      key: value.key,
      text: value.text,
      ...(value.asksKey && { asksKey: true }),
      ...(format && { format }),
    },
  };
}

/**
 * The tree with each condition the reader is making (`asksKey`) moved onto
 * its key's type, for a type that arrived after the key was typed: an
 * operator the key takes, a value in its format. A condition read from a
 * query is never rewritten. A tree with nothing to move is returned as it is.
 */
export function withFilterKeyTypes(
  group: TFilterGroup,
  fields: TFilterFields
): TFilterGroup {
  const children = group.children.map((node): TFilterNode => {
    if (node.kind === 'group') {
      return withFilterKeyTypes(node, fields);
    }

    const { value } = node;

    if (
      value.kind !== 'keyed' ||
      value.asksKey !== true ||
      !filterKeyType(fields[node.field], value.key)
    ) {
      return node;
    }

    const typed = withFilterValue(node, value, fields);

    return typed.operator === node.operator &&
      typed.value.kind === 'keyed' &&
      typed.value.format === value.format
      ? node
      : typed;
  });

  return children.every((child, index) => child === group.children[index])
    ? group
    : { ...group, children };
}

/** An id unique in this document, for React keys and drag and drop. */
export const filterNodeId = (): string =>
  `filter-${Math.random().toString(36).slice(2, 10)}`;

/** A new condition on a field: its first operator, an empty value. */
export function createFilterCondition(
  fields: TFilterFields,
  field: string = Object.keys(fields)[0] ?? ''
): TFilterCondition {
  const config = fields[field];
  const operator = config ? (filterOperators(config)[0]?.value ?? 'eq') : 'eq';
  const value = filterValueFor(config, operator);

  return withFilterValue(
    { kind: 'condition', id: filterNodeId(), field, operator, value },
    value,
    fields
  );
}

export const createFilterGroup = (
  join: TFilterJoin = 'and',
  children: readonly TFilterNode[] = []
): TFilterGroup => ({ kind: 'group', id: filterNodeId(), join, children });

/**
 * A new group to open under a group of `parentJoin`: the other join, with one
 * condition. Under an `$or`, the group a reader opens is almost always an
 * `$and`, and the reverse.
 */
export const createFilterSubgroup = (
  fields: TFilterFields,
  parentJoin: TFilterJoin
): TFilterGroup =>
  createFilterGroup(parentJoin === 'and' ? 'or' : 'and', [
    createFilterCondition(fields),
  ]);

/** The conditions a node holds, at any depth. */
export const countFilterConditions = (node: TFilterNode): number =>
  node.kind === 'condition'
    ? 1
    : node.children.reduce(
        (total, child) => total + countFilterConditions(child),
        0
      );

/** The group of this id at any depth, the root included, or `null`. */
export function findFilterGroup(
  node: TFilterNode,
  id: string
): TFilterGroup | null {
  if (node.kind === 'condition') {
    return null;
  }

  if (node.id === id) {
    return node;
  }

  for (const child of node.children) {
    const found = findFilterGroup(child, id);

    if (found) {
      return found;
    }
  }

  return null;
}

/**
 * The tree with the group of this id replaced by `update(group)`, at any
 * depth. A tree without that group is returned as it is.
 */
export function updateFilterGroup(
  root: TFilterGroup,
  id: string,
  update: (group: TFilterGroup) => TFilterGroup
): TFilterGroup {
  if (root.id === id) {
    return update(root);
  }

  return {
    ...root,
    children: root.children.map((child) =>
      child.kind === 'group' ? updateFilterGroup(child, id, update) : child
    ),
  };
}

/** The path the ledger reads: `metadata[type]`, `balance[USD/2]`, `reference`. */
function conditionPath(
  condition: TFilterCondition,
  field: TFilterField | undefined
): string {
  if (condition.value.kind !== 'keyed') {
    return condition.field;
  }

  return field?.variant === 'balanceByAsset'
    ? `balance[${condition.value.key}]`
    : `metadata[${condition.value.key}]`;
}

/**
 * A number as the JSON the ledger reads. An integer past
 * `Number.MAX_SAFE_INTEGER` stays a decimal string: ledger ids are uint64, and
 * `Number()` would round it onto another id.
 */
function toNumber(raw: string): unknown {
  const parsed = Number(raw);

  if (raw.trim() === '' || !Number.isFinite(parsed)) {
    return raw;
  }

  return Number.isInteger(parsed) && !Number.isSafeInteger(parsed)
    ? raw.trim()
    : parsed;
}

/** One text value written in the field's type, or in its own format. */
function scalarOf(
  text: string,
  field: TFilterField | undefined,
  operator: TFilterOperator,
  format?: TFilterKeyedFormat
): unknown {
  switch (field?.variant) {
    case 'boolean':
      return text === 'true';
    case 'number':
    case 'slider':
    case 'balanceByAsset':
      return toNumber(text);
    case 'metadata':
      return format === 'bool'
        ? text.trim() === 'true'
        : format === 'decimalString'
          ? text.trim()
          : operator === 'eq' || operator === 'ne' || operator === 'in'
            ? text
            : toNumber(text);
    default:
      return text;
  }
}

/**
 * The items of a list as the query holds them: trimmed, blanks dropped. The
 * builder keeps a list as typed, so a trailing comma stays in its input.
 */
const cleanItems = (items: readonly string[]): string[] =>
  items.map((one) => one.trim()).filter((one) => one !== '');

/** Whether a condition says enough to be written: a key, a value. */
export function isFilterConditionComplete(
  condition: TFilterCondition
): boolean {
  const { value } = condition;

  if (value.kind === 'keyed' && value.key.trim() === '') {
    return false;
  }

  if (takesNoValue(condition.operator)) {
    return true;
  }

  switch (value.kind) {
    case 'text':
      return value.text.trim() !== '';
    case 'list':
      return cleanItems(value.items).length > 0;
    case 'keyed':
      return value.text.trim() !== '';
    case 'instants':
      return value.from !== '' && value.to !== '';
  }
}

/**
 * The document one condition is written as: the ledger query a flat filter
 * writes for the same field, operator and value, so the ledger reads it as it
 * reads the flat filters. A date range is one `$and` of a `$gte` and a `$lte`,
 * which the ledger reads as one range.
 */
function conditionQuery(
  condition: TFilterCondition,
  fields: TFilterFields
): TFilterQuery | null {
  if (!isFilterConditionComplete(condition)) {
    return null;
  }

  const field = fields[condition.field];
  const path = conditionPath(condition, field);
  const { operator, value } = condition;

  if (value.kind === 'instants') {
    return {
      $and: [{ $gte: { [path]: value.from } }, { $lte: { [path]: value.to } }],
    };
  }

  if (takesNoValue(operator)) {
    // The ledger reads a metadata key's presence as `{"$exists": {"metadata":
    // "<key>"}}` and refuses `metadata[<key>]` as the field of an `$exists`.
    const exists = {
      $exists:
        value.kind === 'keyed' && field?.variant === 'metadata'
          ? { metadata: value.key }
          : { [path]: true },
    };

    return operator === 'isEmpty' ? { $not: exists } : exists;
  }

  if (value.kind === 'list') {
    return { $in: { [path]: cleanItems(value.items) } };
  }

  if (operator === 'in') {
    // A keyed "in" is typed comma-separated.
    const items = cleanItems(value.text.split(','));

    return items.length === 1
      ? { $match: { [path]: items[0] } }
      : { $or: items.map((one) => ({ $match: { [path]: one } })) };
  }

  const scalar = scalarOf(
    value.text,
    field,
    operator,
    value.kind === 'keyed' ? value.format : undefined
  );

  switch (operator) {
    case 'ne':
      return { $not: { $match: { [path]: scalar } } };
    case 'like':
      return { $like: { [path]: scalar } };
    case 'lt':
    case 'lte':
    case 'gt':
    case 'gte':
      return { [`$${operator}`]: { [path]: scalar } };
    default:
      return { $match: { [path]: scalar } };
  }
}

/**
 * The ledger query a filter asks. A group is one `$and` or `$or` of its
 * children; a group that holds one written child is that child; a condition
 * that is not complete is left out. Nothing written is `null`: every row.
 */
export function queryOfFilter(
  node: TFilterNode,
  fields: TFilterFields
): TFilterQuery | null {
  if (node.kind === 'condition') {
    return conditionQuery(node, fields);
  }

  const parts = node.children
    .map((child) => queryOfFilter(child, fields))
    .filter((part): part is TFilterQuery => part !== null);

  if (parts.length === 0) {
    return null;
  }

  return parts.length === 1 ? parts[0]! : { [`$${node.join}`]: parts };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** The one key of an object that holds exactly one, or `null`. */
function onlyKey(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  const keys = Object.keys(value);

  return keys.length === 1 ? keys[0]! : null;
}

/**
 * The field and named key a ledger path is read under. A metadata key with a
 * field of its own (`key`) is read on that field, any other key on the keyed
 * field with no key.
 */
function fieldOfPath(
  path: string,
  fields: TFilterFields
): { field: string; key: string | null } | null {
  const keyed = /^(metadata|balance)\[(.+)\]$/.exec(path);

  if (keyed) {
    const variant = keyed[1] === 'metadata' ? 'metadata' : 'balanceByAsset';
    const key = keyed[2]!;
    const ids = Object.keys(fields).filter(
      (one) => fields[one]?.variant === variant
    );
    const field =
      ids.find((one) => fields[one]?.key === key) ??
      ids.find((one) => fields[one]?.key === undefined);

    return field ? { field, key } : null;
  }

  return fields[path] && !isKeyedVariant(fields[path].variant)
    ? { field: path, key: null }
    : null;
}

const LEAF_OPERATORS: Record<string, TFilterOperator> = {
  $match: 'eq',
  $like: 'like',
  $in: 'in',
  $lt: 'lt',
  $lte: 'lte',
  $gt: 'gt',
  $gte: 'gte',
  $exists: 'isNotEmpty',
};

/** One comparison on one path, `{ $op: { path: raw } }`, or its `$not`. */
function leafOf(
  part: unknown
): { operator: TFilterOperator; path: string; raw: unknown } | null {
  const op = onlyKey(part);

  if (op === null || !isRecord(part)) {
    return null;
  }

  if (op === '$not') {
    const inner = leafOf(part.$not);
    const negated =
      inner?.operator === 'eq'
        ? 'ne'
        : inner?.operator === 'isNotEmpty'
          ? 'isEmpty'
          : null;

    return inner && negated ? { ...inner, operator: negated } : null;
  }

  const operator = LEAF_OPERATORS[op];
  const body = part[op];
  const path = onlyKey(body);

  if (!operator || path === null || !isRecord(body)) {
    return null;
  }

  // `{"$exists": {"metadata": "<key>"}}`: the presence of one metadata key.
  return op === '$exists' &&
    path === 'metadata' &&
    typeof body[path] === 'string'
    ? { operator, path: `metadata[${body[path]}]`, raw: '' }
    : { operator, path, raw: body[path] };
}

const textOf = (raw: unknown): string | null =>
  typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean'
    ? String(raw)
    : null;

/** A date range: an `$and` of a `$gte` then a `$lte` on one range field. */
function rangeOf(part: unknown, fields: TFilterFields): TFilterNode | null {
  const members = isRecord(part) ? part.$and : null;

  if (!Array.isArray(members) || members.length !== 2) {
    return null;
  }

  const from = leafOf(members[0]);
  const to = leafOf(members[1]);
  const fromText = textOf(from?.raw);
  const toText = textOf(to?.raw);

  if (
    from?.operator !== 'gte' ||
    to?.operator !== 'lte' ||
    from.path !== to.path ||
    fields[from.path]?.variant !== 'dateRange' ||
    fromText === null ||
    toText === null
  ) {
    return null;
  }

  return {
    kind: 'condition',
    id: filterNodeId(),
    field: from.path,
    operator: 'dateRange',
    value: { kind: 'instants', from: fromText, to: toText },
  };
}

/** The node one part of a query is, or `null` for a shape it cannot hold. */
function nodeOf(part: unknown, fields: TFilterFields): TFilterNode | null {
  const range = rangeOf(part, fields);

  if (range) {
    return range;
  }

  const op = onlyKey(part);

  if ((op === '$and' || op === '$or') && isRecord(part)) {
    const members = part[op];

    if (!Array.isArray(members)) {
      return null;
    }

    const children = members.map((member) => nodeOf(member, fields));

    return children.every((child): child is TFilterNode => child !== null)
      ? createFilterGroup(op === '$and' ? 'and' : 'or', children)
      : null;
  }

  const leaf = leafOf(part);
  const target = leaf ? fieldOfPath(leaf.path, fields) : null;

  if (!leaf || !target) {
    return null;
  }

  const items = Array.isArray(leaf.raw) ? leaf.raw.map(textOf) : null;
  const text = textOf(leaf.raw);
  // A metadata value the text alone would write as another JSON: a bool, or
  // a bound written as a decimal string (an unsigned key's).
  const format: TFilterKeyedFormat | null =
    fields[target.field]?.variant !== 'metadata'
      ? null
      : typeof leaf.raw === 'boolean'
        ? 'bool'
        : typeof leaf.raw === 'string' &&
            isBound(leaf.operator) &&
            /^\d+$/.test(leaf.raw)
          ? 'decimalString'
          : null;
  const value: TFilterValue | null =
    target.key !== null
      ? text === null
        ? null
        : {
            kind: 'keyed',
            key: target.key,
            text,
            ...(format && { format }),
          }
      : items
        ? items.every((one): one is string => one !== null)
          ? { kind: 'list', items }
          : null
        : text === null
          ? null
          : { kind: 'text', text };

  return value
    ? {
        kind: 'condition',
        id: filterNodeId(),
        field: target.field,
        operator: leaf.operator,
        value: !takesNoValue(leaf.operator)
          ? value
          : value.kind === 'keyed'
            ? { ...value, text: '' }
            : filterValueFor(fields[target.field], leaf.operator),
      }
    : null;
}

/**
 * The filter a stored ledger query is drawn as, or `null` when the builder
 * cannot hold it exactly.
 *
 * **Reading never loses anything**: the filter read is
 * written back and compared with the query, so a query a colleague sent is
 * never rewritten by the screen that shows it. A `null` is the caller's cue to
 * open the raw editor instead. The root is always a group, so a lone `$match`
 * is a group of one condition.
 */
export function filterOfQuery(
  query: TFilterQuery | null,
  fields: TFilterFields
): TFilterGroup | null {
  if (query === null || Object.keys(query).length === 0) {
    return createFilterGroup();
  }

  const node = nodeOf(query, fields);

  if (!node) {
    return null;
  }

  const root = node.kind === 'group' ? node : createFilterGroup('and', [node]);

  return JSON.stringify(queryOfFilter(root, fields)) === JSON.stringify(query)
    ? root
    : null;
}

/** A SQL `LIKE` pattern as a whole-value regular expression. */
const likePattern = (pattern: string): RegExp =>
  new RegExp(
    `^${pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/%/g, '.*')
      .replace(/_/g, '.')}$`,
    'i'
  );

/** A row value or a written threshold as decimal text, or `null` if no number. */
const decimalOf = (one: unknown): string | null => {
  if (typeof one === 'number') {
    return Number.isFinite(one) ? String(one) : null;
  }

  return typeof one === 'string' &&
    one.trim() !== '' &&
    Number.isFinite(Number(one))
    ? one.trim()
    : null;
};

const INTEGER = /^-?\d+$/;

/**
 * The sign of `actual - expected`, or `null` when one of them is no number.
 * Two integers compare as `BigInt`: a uint64 id past `Number.MAX_SAFE_INTEGER`
 * stays a decimal string in the query, and `Number()` would round it onto a
 * neighbour.
 */
function compareNumbers(actual: unknown, expected: unknown): number | null {
  const left = decimalOf(actual);
  const right = decimalOf(expected);

  if (left === null || right === null) {
    return null;
  }

  if (INTEGER.test(left) && INTEGER.test(right)) {
    const [a, b] = [BigInt(left), BigInt(right)];

    return a === b ? 0 : a < b ? -1 : 1;
  }

  return Math.sign(Number(left) - Number(right));
}

/** Whether one row passes one complete condition. */
function conditionMatches(
  condition: TFilterCondition,
  fields: TFilterFields,
  read: (path: string) => unknown
): boolean {
  const field = fields[condition.field];
  const actual = read(conditionPath(condition, field));
  const { operator, value } = condition;
  const empty = actual === undefined || actual === null || actual === '';

  if (operator === 'isEmpty') {
    return empty;
  }

  if (operator === 'isNotEmpty') {
    return !empty;
  }

  if (value.kind === 'instants') {
    const at = new Date(String(actual)).getTime();

    return (
      at >= new Date(value.from).getTime() && at <= new Date(value.to).getTime()
    );
  }

  if (value.kind === 'list') {
    return cleanItems(value.items).includes(String(actual));
  }

  const text = value.text;

  if (operator === 'in') {
    return cleanItems(text.split(',')).includes(String(actual));
  }

  const expected = scalarOf(
    text,
    field,
    operator,
    value.kind === 'keyed' ? value.format : undefined
  );
  const compare = compareNumbers(actual, expected);

  switch (operator) {
    case 'ne':
      return String(actual) !== String(expected);
    case 'like':
      return likePattern(text).test(String(actual));
    case 'lt':
      return compare !== null && compare < 0;
    case 'lte':
      return compare !== null && compare <= 0;
    case 'gt':
      return compare !== null && compare > 0;
    case 'gte':
      return compare !== null && compare >= 0;
    default:
      return String(actual) === String(expected);
  }
}

/**
 * Whether one row passes the written part of a node, or `null` when nothing
 * in it is written. A condition that is not complete is left out, as it is
 * left out of the query: under an `$or`, it must not let every row through.
 */
function writtenMatches(
  node: TFilterNode,
  fields: TFilterFields,
  read: (path: string) => unknown
): boolean | null {
  if (node.kind === 'condition') {
    return isFilterConditionComplete(node)
      ? conditionMatches(node, fields, read)
      : null;
  }

  const results = node.children
    .map((child) => writtenMatches(child, fields, read))
    .filter((result) => result !== null);

  if (results.length === 0) {
    return null;
  }

  return node.join === 'and'
    ? results.every((result) => result)
    : results.some((result) => result);
}

/**
 * Whether one row passes a filter, for a table filtered in the browser. `read`
 * gives the row's value at a ledger path (`metadata[type]`, `reference`). A
 * filter with nothing written lets every row through.
 */
export const filterMatches = (
  node: TFilterNode,
  fields: TFilterFields,
  read: (path: string) => unknown
): boolean => writtenMatches(node, fields, read) ?? true;

/** A day on a calendar, in no time zone. `month` counts from 1. */
export type TFilterDay = { year: number; month: number; day: number };

const ZONE_CLOCKS = new Map<string, Intl.DateTimeFormat>();

/** The wall clock of an instant in a time zone, to the second. */
function zoneClock(instant: number, timeZone: string) {
  let clock = ZONE_CLOCKS.get(timeZone);

  if (!clock) {
    clock = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    ZONE_CLOCKS.set(timeZone, clock);
  }

  const parts = Object.fromEntries(
    clock
      .formatToParts(instant)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)])
  );

  return {
    year: parts.year!,
    month: parts.month!,
    day: parts.day!,
    hour: parts.hour!,
    minute: parts.minute!,
    second: parts.second!,
  };
}

/** The day an instant falls on in a time zone. */
export function filterDayOf(instant: Date, timeZone: string): TFilterDay {
  const { year, month, day } = zoneClock(instant.getTime(), timeZone);

  return { year, month, day };
}

/**
 * How far a time zone's wall clock is ahead of UTC at an instant, in
 * milliseconds: negative west of UTC.
 */
function zoneOffset(instant: number, timeZone: string): number {
  const clock = zoneClock(instant, timeZone);
  const wall = Date.UTC(
    clock.year,
    clock.month - 1,
    clock.day,
    clock.hour,
    clock.minute,
    clock.second
  );

  return wall - Math.floor(instant / 1000) * 1000;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The first instant of a day in a time zone: its midnight, or, where the
 * clock skips midnight, the instant the clock moves into the day. Each
 * offset the zone has around the day gives one candidate; the first one that
 * falls on the day is its start.
 */
export function filterDayStart(day: TFilterDay, timeZone: string): Date {
  const midnight = Date.UTC(day.year, day.month - 1, day.day);
  const starts = [midnight - DAY_MS, midnight, midnight + DAY_MS]
    .map((near) => midnight - zoneOffset(near, timeZone))
    .filter((start) => {
      const clock = zoneClock(start, timeZone);

      return (
        clock.year === day.year &&
        clock.month === day.month &&
        clock.day === day.day
      );
    });

  return new Date(Math.min(...starts));
}

/**
 * The last millisecond of a day in a time zone: the next day's start less
 * 1 ms, so a day of 23 or 25 hours ends where its clock does.
 */
export function filterDayEnd(day: TFilterDay, timeZone: string): Date {
  const next = new Date(Date.UTC(day.year, day.month - 1, day.day + 1));

  return new Date(
    filterDayStart(
      {
        year: next.getUTCFullYear(),
        month: next.getUTCMonth() + 1,
        day: next.getUTCDate(),
      },
      timeZone
    ).getTime() - 1
  );
}

/**
 * A range of whole days as two instants (RFC 3339): the first day from its
 * start, the last to its end, so a one-day range holds that whole day.
 */
export const filterDayRange = (
  from: TFilterDay,
  to: TFilterDay,
  timeZone: string
): Extract<TFilterValue, { kind: 'instants' }> => ({
  kind: 'instants',
  from: filterDayStart(from, timeZone).toISOString(),
  to: filterDayEnd(to, timeZone).toISOString(),
});

/**
 * One day as one bound, in signed Unix microseconds. A bound that holds the
 * day (`≥`, `≤`) or leaves it out (`<`, `>`) takes the start or the end of
 * the day, so a day picked is a whole day. The end is its last microsecond.
 */
export function filterDayMicros(
  day: TFilterDay,
  operator: TFilterOperator,
  timeZone: string
): string {
  const isEnd = operator === 'gt' || operator === 'lte';
  const edge = isEnd
    ? filterDayEnd(day, timeZone)
    : filterDayStart(day, timeZone);

  return String(edge.getTime() * 1000 + (isEnd ? 999 : 0));
}

/**
 * The day a calendar's pick names. A calendar gives a day as a `Date` at its
 * midnight on the browser's clock: its fields on that clock are the day, not
 * an instant.
 */
export const filterDayOfPick = (picked: Date): TFilterDay => ({
  year: picked.getFullYear(),
  month: picked.getMonth() + 1,
  day: picked.getDate(),
});

/** A day as a calendar draws it: a `Date` at its midnight on the browser's clock. */
export const filterPickOfDay = (day: TFilterDay): Date =>
  new Date(day.year, day.month - 1, day.day);
