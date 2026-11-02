export type TFilterJoin = 'and' | 'or';

/**
 * The operators and variants of `@platform/query/filters` (`operators.ts`),
 * with the same names, so a platform `FilterConfig` is a `TFilterFields` as it
 * is: no adapter between the console's vocabulary and this builder.
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
};

/** A resource's filter vocabulary, keyed by the path the ledger reads. */
export type TFilterFields = Record<string, TFilterField>;

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
  | { kind: 'keyed'; key: string; text: string }
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

/** The operators a field offers: its own, else its variant's. */
export const filterOperators = (
  field: TFilterField
): readonly TFilterOperatorOption[] =>
  field.operators ?? VARIANT_OPERATORS[field.variant];

const isKeyedVariant = (variant: TFilterVariant | undefined) =>
  variant === 'metadata' || variant === 'balanceByAsset';

/** The operators that compare nothing: they take no value. */
const takesNoValue = (operator: TFilterOperator) =>
  operator === 'isEmpty' || operator === 'isNotEmpty';

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
      return { kind, key: '', text: '' };
    case 'list':
      return { kind, items: [] };
    case 'text':
      return { kind, text: '' };
  }
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

  return {
    kind: 'condition',
    id: filterNodeId(),
    field,
    operator,
    value: filterValueFor(config, operator),
  };
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
 * `Number()` would round it onto another id. Same rule as the platform builder.
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

/** One text value written in the field's type. */
function scalarOf(
  text: string,
  field: TFilterField | undefined,
  operator: TFilterOperator
): unknown {
  switch (field?.variant) {
    case 'boolean':
      return text === 'true';
    case 'number':
    case 'slider':
    case 'balanceByAsset':
      return toNumber(text);
    case 'metadata':
      return operator === 'eq' || operator === 'ne' || operator === 'in'
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
 * The document one condition is written as: the shape the platform builder
 * (`@platform/query/filters/builder.ts`) emits for the same field, operator and
 * value, so the ledger reads it as it reads the flat filters. A date range is
 * one `$and` of a `$gte` and a `$lte`, which the ledger reads as one range.
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

  if (operator === 'isEmpty') {
    return { $not: { $exists: { [path]: true } } };
  }

  if (operator === 'isNotEmpty') {
    return { $exists: { [path]: true } };
  }

  if (value.kind === 'list') {
    return { $in: { [path]: cleanItems(value.items) } };
  }

  if (operator === 'in') {
    // A keyed "in" is typed comma-separated, as the platform builder reads it.
    const items = cleanItems(value.text.split(','));

    return items.length === 1
      ? { $match: { [path]: items[0] } }
      : { $or: items.map((one) => ({ $match: { [path]: one } })) };
  }

  const scalar = scalarOf(value.text, field, operator);

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

/** The field and named key a ledger path is read under. */
function fieldOfPath(
  path: string,
  fields: TFilterFields
): { field: string; key: string | null } | null {
  const keyed = /^(metadata|balance)\[(.+)\]$/.exec(path);

  if (keyed) {
    const variant = keyed[1] === 'metadata' ? 'metadata' : 'balanceByAsset';
    const field = Object.keys(fields).find(
      (one) => fields[one]?.variant === variant
    );

    return field ? { field, key: keyed[2]! } : null;
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

  return operator && path !== null && isRecord(body)
    ? { operator, path, raw: body[path] }
    : null;
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
  const value: TFilterValue | null =
    target.key !== null
      ? text === null
        ? null
        : { kind: 'keyed', key: target.key, text }
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
        value: takesNoValue(leaf.operator)
          ? filterValueFor(fields[target.field], leaf.operator)
          : value,
      }
    : null;
}

/**
 * The filter a stored ledger query is drawn as, or `null` when the builder
 * cannot hold it exactly.
 *
 * **Reading never loses anything** (console ADR-0047): the filter read is
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

  const expected = scalarOf(text, field, operator);
  const compare = typeof expected === 'number' ? Number(actual) - expected : 0;

  switch (operator) {
    case 'ne':
      return String(actual) !== String(expected);
    case 'like':
      return likePattern(text).test(String(actual));
    case 'lt':
      return compare < 0;
    case 'lte':
      return compare <= 0;
    case 'gt':
      return compare > 0;
    case 'gte':
      return compare >= 0;
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
