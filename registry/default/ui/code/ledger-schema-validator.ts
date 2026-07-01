import Ajv, { type ErrorObject, type SchemaObject } from 'ajv';
import { parse as parseYaml, YAMLParseError } from 'yaml';

import type { TDiagnostic } from '@/registry/default/ui/code/code-editor';

/**
 * Which canonical ledger schema to validate against:
 * - `base` — the strict contract (rejects unknown top-level keys). Use this to
 *   author ledger schemas.
 * - `extended` — the base contract plus a top-level `meta` block, for docs /
 *   library entries that carry metadata.
 *
 * The rules come from the hosted schema, so every consumer agrees on validity;
 * pass a custom `schema` (see `TLedgerSchemaValidatorOptions`) to override.
 */
export type TLedgerSchemaType = 'base' | 'extended';

export type TLedgerSchemaValidatorOptions = {
  /** Which hosted schema to validate against. @default 'base' */
  type?: TLedgerSchemaType;
  /**
   * Validate against this JSON Schema instead of the hosted one. When set, the
   * hosted schema is not fetched and `type` is ignored — use this to override
   * with your own contract.
   */
  schema?: object;
};

const SCHEMA_URLS: Record<TLedgerSchemaType, string> = {
  base: 'https://ds.formance.com/schemas/ledger-schema',
  extended: 'https://ds.formance.com/schemas/ledger-schema/extended',
};

type TCompiledValidator = (data: unknown) => ErrorObject[];

function compile(schema: object): TCompiledValidator {
  const validate = new Ajv({ allErrors: true, strict: false }).compile(
    schema as SchemaObject
  );

  return (data: unknown): ErrorObject[] =>
    validate(data) ? [] : (validate.errors ?? []);
}

// Fetch + compile each hosted schema once, reused across keystrokes. A
// *successful* compile is memoized; a failure is evicted so a transient error
// (offline, CORS, non-2xx) retries on the next call instead of disabling
// validation for the whole session.
const urlCache = new Map<string, Promise<TCompiledValidator>>();
// Custom schemas are compiled once per object identity — pass a stable object.
const schemaCache = new WeakMap<object, TCompiledValidator>();

function getUrlValidator(url: string): Promise<TCompiledValidator> {
  const cached = urlCache.get(url);
  if (cached) return cached;

  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`ledger schema ${res.status}`);

      return res.json();
    })
    .then(compile)
    .catch((error) => {
      urlCache.delete(url);
      throw error;
    });

  urlCache.set(url, promise);

  return promise;
}

function getSchemaValidator(schema: object): TCompiledValidator {
  const cached = schemaCache.get(schema);
  if (cached) return cached;

  const validator = compile(schema);
  schemaCache.set(schema, validator);

  return validator;
}

function findLineForProperty(lines: string[], propertyName: string): number {
  for (let i = 0; i < lines.length; i++) {
    const trimmed = (lines[i] ?? '').trim();
    if (
      trimmed.startsWith(`${propertyName}:`) ||
      trimmed.startsWith(`- ${propertyName}:`)
    ) {
      return i + 1;
    }
  }

  return 1;
}

function formatSchemaError(error: ErrorObject): string {
  const path = error.instancePath || 'root';
  const message = error.message || 'validation failed';

  switch (error.keyword) {
    case 'required':
      return `Missing required property "${error.params.missingProperty}" at ${path}`;
    case 'type':
      return `Expected ${error.params.type} at ${path}`;
    case 'additionalProperties':
      return `Unknown property "${error.params.additionalProperty}" at ${path}`;
    case 'enum':
      return `Invalid value at ${path}. Allowed: ${(error.params.allowedValues as string[])?.join(', ')}`;
    case 'pattern':
      return `Invalid format at ${path}: ${message}`;
    case 'not': {
      // `not` rejects invalid dot-prefixed properties in chart segments.
      const propertyName = path.split('/').pop() || '';
      if (propertyName.startsWith('.')) {
        return `Unknown chart property "${propertyName}" at ${path}. Only .self, .pattern, .metadata, .rules are allowed.`;
      }

      return `Invalid value at ${path}`;
    }
    default:
      return `${path}: ${message}`;
  }
}

function errorsToDiagnostics(
  errors: ErrorObject[],
  yamlText: string
): TDiagnostic[] {
  const lines = yamlText.split('\n');

  return errors.map((error) => {
    let searchProperty: string | null = null;

    if (
      error.keyword === 'additionalProperties' &&
      error.params.additionalProperty
    ) {
      searchProperty = error.params.additionalProperty as string;
    } else {
      const parts = error.instancePath.split('/').filter(Boolean);
      const last = parts.at(-1);
      // A trailing numeric segment is an array index — point at its parent key.
      searchProperty = /^\d+$/.test(last ?? '')
        ? (parts.at(-2) ?? null)
        : (last ?? null);
    }

    let line = searchProperty ? findLineForProperty(lines, searchProperty) : 1;
    if (line === 1 && error.instancePath) {
      const first = error.instancePath.split('/').filter(Boolean)[0];
      if (first) line = findLineForProperty(lines, first);
    }

    const lineContent = lines[line - 1] ?? '';

    return {
      startLineNumber: line,
      startColumn: 1,
      endLineNumber: line,
      endColumn: lineContent.length + 1,
      message: formatSchemaError(error),
      severity: 'error' as const,
    };
  });
}

/**
 * Validate a ledger schema (YAML or JSON — JSON is a YAML subset), returning
 * diagnostics for the CodeEditor. By default the verdict comes from the hosted
 * canonical schema, so every consumer agrees on validity; `type` selects base
 * vs extended, or pass a custom `schema` to override.
 *
 * If a hosted schema can't be loaded, a single non-blocking notice is returned
 * rather than crashing or silently passing — editing and saving keep working.
 */
export async function validateLedgerSchema(
  value: string,
  options: TLedgerSchemaValidatorOptions = {}
): Promise<TDiagnostic[]> {
  if (!value.trim()) return [];

  let parsed: unknown;
  try {
    parsed = parseYaml(value);
  } catch (error) {
    const pos =
      error instanceof YAMLParseError ? error.linePos?.[0] : undefined;
    const line = pos?.line ?? 1;
    const lineContent = value.split('\n')[line - 1] ?? '';

    return [
      {
        startLineNumber: line,
        startColumn: pos?.col ?? 1,
        endLineNumber: line,
        endColumn: lineContent.length + 1,
        message: error instanceof Error ? error.message : 'Invalid YAML',
        severity: 'error',
      },
    ];
  }

  // Truly-empty input is already handled above; a non-empty document that
  // parses to null (e.g. `null` or `~`) is still validated — the schema
  // requires an object, so it should be flagged, not silently passed.

  let validate: TCompiledValidator;
  if (options.schema) {
    validate = getSchemaValidator(options.schema);
  } else {
    try {
      validate = await getUrlValidator(SCHEMA_URLS[options.type ?? 'base']);
    } catch {
      return [
        {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 1,
          message: "Couldn't load the ledger schema — validation paused.",
          severity: 'warning',
        },
      ];
    }
  }

  return errorsToDiagnostics(validate(parsed), value);
}

/**
 * A `TDiagnosticsConfig.validate` function bound to a schema — pass the result
 * straight to `<CodeEditor diagnostics={{ validate }} />`.
 */
export function createLedgerSchemaValidator(
  options: TLedgerSchemaValidatorOptions = {}
) {
  return (value: string) => validateLedgerSchema(value, options);
}
