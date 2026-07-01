'use client';

import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

import { cn } from '@/lib/utils';
import {
  CodeEditor,
  type TDiagnostic,
  type TDiagnosticsConfig,
} from '@/registry/default/ui/code/code-editor';
import {
  createLedgerSchemaValidator,
  type TLedgerSchemaValidatorOptions,
} from '@/registry/default/ui/code/ledger-schema-validator';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';

type TFormat = 'yaml' | 'json';

export type TLedgerSchemaStatus =
  | { kind: 'empty' }
  | { kind: 'valid' }
  | { kind: 'errors'; count: number };

/** Structural equality via canonical JSON — good enough to tell whether a JSON
 *  edit changed the data vs. the YAML we left. */
function sameData(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Re-render the buffer in the target format. When returning to YAML from an
 * unchanged JSON detour, restore the original YAML verbatim so comments and
 * formatting survive (JSON can't carry them). Returns null if the buffer can't
 * be parsed, so in-progress text is left untouched.
 */
function convertFormat(
  text: string,
  to: TFormat,
  yamlSource: string | null
): { text: string; yamlSource: string | null } | null {
  let parsed: unknown;
  try {
    parsed = parseYaml(text);
  } catch {
    return null;
  }
  if (parsed === null || parsed === undefined) return null;

  if (to === 'json') {
    return { text: JSON.stringify(parsed, null, 2), yamlSource: text };
  }

  if (yamlSource) {
    try {
      if (sameData(parseYaml(yamlSource), parsed)) {
        return { text: yamlSource, yamlSource: null };
      }
    } catch {
      // fall through and re-serialize
    }
  }

  return { text: stringifyYaml(parsed), yamlSource: null };
}

function diagnosticsToStatus(
  value: string,
  diagnostics: TDiagnostic[]
): TLedgerSchemaStatus {
  if (!value.trim()) return { kind: 'empty' };
  if (diagnostics.length === 0) return { kind: 'valid' };

  return { kind: 'errors', count: diagnostics.length };
}

function StatusPill({ status }: { status: TLedgerSchemaStatus }) {
  if (status.kind === 'empty') {
    return <span className="text-muted-foreground text-xs">Empty</span>;
  }
  if (status.kind === 'valid') {
    return (
      <span className="text-xs text-emerald-600 dark:text-emerald-400">
        Schema valid
      </span>
    );
  }

  return (
    <span className="text-destructive text-xs">
      {status.count} {status.count === 1 ? 'error' : 'errors'}
    </span>
  );
}

// Inherit every CodeEditor prop (value, onChange, height, withNavigator,
// isReadonly, bordered, fill, …) except the two this component owns — `language`
// is driven by the YAML/JSON toggle and `diagnostics` by the validator — plus
// the validator's own options (`type` / `schema`).
export type TLedgerSchemaEditorProps = Omit<
  ComponentProps<typeof CodeEditor>,
  'language' | 'diagnostics'
> &
  TLedgerSchemaValidatorOptions & {
    /** Notified whenever validation status changes (empty / valid / N errors). */
    onValidityChange?: (status: TLedgerSchemaStatus) => void;
  };

/**
 * A self-contained ledger schema editor: a Monaco `CodeEditor` with a YAML⇄JSON
 * toggle, live validation against the hosted canonical schema, and a valid /
 * N-errors status. Consumers that need more (share, templates, save, …) can wrap
 * it or build their own around `createLedgerSchemaValidator`.
 */
export function LedgerSchemaEditor({
  value,
  onChange,
  type,
  schema,
  onValidityChange,
  withNavigator = true,
  height = 400,
  adaptiveHeight = false,
  className,
  ...codeEditorProps
}: TLedgerSchemaEditorProps) {
  const [format, setFormat] = useState<TFormat>('yaml');
  const [status, setStatus] = useState<TLedgerSchemaStatus>({ kind: 'empty' });

  // The YAML we last left when switching to JSON, so switching back can restore
  // its comments/formatting verbatim. Ref because it's toggle plumbing, not
  // render state.
  const yamlSourceRef = useRef<string | null>(null);
  // Latest value, so an async validation only updates status if still current.
  const latestValueRef = useRef(value);
  // Kept in a ref so a new onValidityChange identity doesn't rebuild the validator.
  const onValidityChangeRef = useRef(onValidityChange);
  // Sync refs after each render — mutating refs during render is disallowed.
  useEffect(() => {
    latestValueRef.current = value;
    onValidityChangeRef.current = onValidityChange;
  });

  const handleFormatChange = useCallback(
    (next: TFormat) => {
      if (next === format) return;
      setFormat(next);
      if (!value.trim()) {
        yamlSourceRef.current = null;

        return;
      }
      const converted = convertFormat(value, next, yamlSourceRef.current);
      if (converted) {
        onChange?.(converted.text);
        yamlSourceRef.current = converted.yamlSource;
      }
    },
    [format, value, onChange]
  );

  const diagnostics: TDiagnosticsConfig = useMemo(() => {
    const validate = createLedgerSchemaValidator({ type, schema });

    return {
      validate: async (source: string) => {
        const results = await validate(source);
        if (source === latestValueRef.current) {
          const next = diagnosticsToStatus(source, results);
          setStatus(next);
          onValidityChangeRef.current?.(next);
        }

        return results;
      },
    };
  }, [type, schema]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <Tabs
          value={format}
          onValueChange={(v) => handleFormatChange(v as TFormat)}
        >
          <TabsList>
            <TabsTrigger value="yaml">YAML</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
        </Tabs>
        <StatusPill status={status} />
      </div>
      <CodeEditor
        {...codeEditorProps}
        value={value}
        language={format}
        onChange={onChange}
        diagnostics={diagnostics}
        withNavigator={withNavigator}
        height={height}
        adaptiveHeight={adaptiveHeight}
      />
    </div>
  );
}
