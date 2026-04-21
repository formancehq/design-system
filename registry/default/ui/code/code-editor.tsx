'use client';

import { Check, Copy } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { CodeNavigator } from '@/registry/default/ui/code/code-navigator';
import {
  buildMonacoThemeFromCSSVars,
  CODE_LANGUAGES,
  getHighlighter,
  MONACO_EDITOR_OPTIONS,
  setupMonacoEnvironment,
  type TCodeLanguage,
} from '@/registry/default/ui/code/code-themes';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TDiagnostic = {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'hint';
};

type TDiagnosticsConfig = {
  validate?: (value: string) => Promise<TDiagnostic[]> | TDiagnostic[];
};

type TMonacoEditorInstance = {
  revealLineInCenter: (line: number) => void;
  setPosition: (position: { lineNumber: number; column: number }) => void;
  focus: () => void;
};

type TCodeEditorProps = {
  value: string;
  defaultValue?: string;
  language: TCodeLanguage;
  onChange?: (value: string) => void;
  /** Fixed height (ignored when `fill` or `adaptiveHeight` is true). @default 400 */
  height?: number | string;
  isReadonly?: boolean;
  canCopy?: boolean;
  onCtrlEnter?: VoidFunction;
  /** Height adapts to content (up to 1000 px). Ignored when `fill` is true. @default true */
  adaptiveHeight?: boolean;
  /** Fill parent container height. Takes precedence over `adaptiveHeight`/`height`. */
  fill?: boolean;
  /** Unfold all code regions by default. @default true */
  defaultUnfoldAll?: boolean;
  bordered?: boolean;
  /** Override dark mode detection. When omitted, auto-detects from `document.documentElement.class`. */
  isDark?: boolean;
  diagnostics?: TDiagnosticsConfig;
  onEditorReady?: (editor: TMonacoEditorInstance) => void;
  /** Show a breadcrumb navigator toolbar for JSON/YAML content. */
  withNavigator?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEVERITY_MAP = { error: 8, warning: 4, info: 2, hint: 1 } as const;
const VALIDATION_DEBOUNCE_MS = 500;
const CTRL_ENTER_EVENT = 'formance:code-editor:ctrl-enter';
const MONACO_THEME_BASE = 'formance-css-vars';

// Guard: Monaco global setup (language registration + Shiki wiring) must run
// exactly once. Without this, React StrictMode's double-mount causes
// "Cannot register two commands with the same id" errors.
type TMonacoSetupResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  monaco: any;
  /** Original setTheme before shikiToMonaco's override */
  setTheme: (name: string) => void;
};

let _monacoSetupPromise: Promise<TMonacoSetupResult> | null = null;

function ensureMonacoSetup(): Promise<TMonacoSetupResult> {
  if (_monacoSetupPromise) return _monacoSetupPromise;

  _monacoSetupPromise = (async () => {
    const monaco = await import('monaco-editor-core');
    const { shikiToMonaco } = await import('@shikijs/monaco');

    setupMonacoEnvironment();

    const highlighter = await getHighlighter();

    CODE_LANGUAGES.forEach((lang) => {
      monaco.languages.register({ id: lang });
    });

    // Save the original setTheme before shikiToMonaco overrides it.
    // We need it to apply the resolved CSS-variables theme later,
    // which isn't registered with Shiki.
    const originalSetTheme = monaco.editor.setTheme.bind(monaco.editor);

    // shikiToMonaco intercepts setTheme/create and needs real hex colors
    // in the Shiki color map — the CSS-variables theme would break Monaco.
    highlighter.setTheme('formance-monaco-fallback');
    shikiToMonaco(highlighter, monaco);

    return { monaco, setTheme: originalSetTheme };
  })();

  return _monacoSetupPromise;
}

// ---------------------------------------------------------------------------
// Height helper
// ---------------------------------------------------------------------------

function getHeightStyle(
  fill: boolean,
  adaptive: boolean,
  height: number | string
): string {
  if (fill) return '100%';
  if (adaptive) return 'auto';

  return typeof height === 'number' ? `${height}px` : height;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function CodeEditor({
  value,
  defaultValue,
  language,
  onChange,
  height = 400,
  isReadonly = false,
  canCopy = true,
  onCtrlEnter,
  adaptiveHeight: adaptiveHeightProp = true,
  fill = false,
  defaultUnfoldAll = true,
  bordered = true,
  isDark,
  diagnostics,
  onEditorReady,
  withNavigator = false,
  className,
  ...htmlProps
}: TCodeEditorProps) {
  const adaptiveHeight = !fill && adaptiveHeightProp;

  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);
  const setThemeRef = useRef<((name: string) => void) | null>(null);
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const diagnosticsRef = useRef(diagnostics);

  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [navigatorEditorRef, setNavigatorEditorRef] =
    useState<TMonacoEditorInstance | null>(null);

  const currentValue = value ?? defaultValue ?? '';
  const isEmpty = currentValue === '{}' || currentValue === '';

  // Keep diagnostics ref current
  useEffect(() => {
    diagnosticsRef.current = diagnostics;
  }, [diagnostics]);

  // Client gate
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ctrl+Enter global event
  useEffect(() => {
    if (!onCtrlEnter) return;
    window.addEventListener(CTRL_ENTER_EVENT, onCtrlEnter);

    return () => window.removeEventListener(CTRL_ENTER_EVENT, onCtrlEnter);
  }, [onCtrlEnter]);

  // Adaptive height
  const updateHeight = useCallback(() => {
    if (!containerRef.current || !editorRef.current || !adaptiveHeight) return;
    const h = Math.min(1000, editorRef.current.getContentHeight());
    containerRef.current.style.height = `${h}px`;
    editorRef.current.layout({
      width: containerRef.current.clientWidth,
      height: h,
    });
  }, [adaptiveHeight]);

  // Validation
  const runValidation = useCallback(async (content: string) => {
    const monaco = monacoRef.current;
    const editor = editorRef.current;
    const validate = diagnosticsRef.current?.validate;
    if (!monaco || !editor || !validate) return;

    const model = editor.getModel();
    if (!model) return;

    const results = await validate(content);
    const markers = results.map(
      (d: TDiagnostic) => ({
        startLineNumber: d.startLineNumber,
        startColumn: d.startColumn,
        endLineNumber: d.endLineNumber,
        endColumn: d.endColumn,
        message: d.message,
        severity: SEVERITY_MAP[d.severity],
      })
    );

    if (editor.getModel() === model) {
      monaco.editor.setModelMarkers(model, 'custom-validation', markers);
    }
  }, []);

  const triggerValidation = useCallback(
    (content: string) => {
      if (validationTimeoutRef.current)
        clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = setTimeout(
        () => runValidation(content),
        VALIDATION_DEBOUNCE_MS
      );
    },
    [runValidation]
  );

  // ---------------------------------------------------------------------------
  // Editor setup
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    let disposed = false;

    (async () => {
      const { monaco, setTheme } = await ensureMonacoSetup();

      if (disposed || !containerRef.current) return;
      monacoRef.current = monaco;
      setThemeRef.current = setTheme;

      // Create the editor with the Shiki-compatible fallback theme.
      // shikiToMonaco intercepts create() and calls its own setTheme()
      // which needs real hex colors in the Shiki color map.
      const editor = monaco.editor.create(containerRef.current, {
        ...MONACO_EDITOR_OPTIONS,
        value: currentValue,
        language,
        theme: 'formance-monaco-fallback',
        readOnly: isReadonly,
      });

      // Apply the resolved CSS-variables theme for proper brand colors.
      const resolvedTheme = buildMonacoThemeFromCSSVars(containerRef.current);
      monaco.editor.defineTheme(
        MONACO_THEME_BASE,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolvedTheme as any
      );
      setTheme(MONACO_THEME_BASE);

      if (disposed) {
        editor.dispose();

        return;
      }

      editorRef.current = editor;

      if (!defaultUnfoldAll) {
        editor.getAction('editor.foldAll')?.run();
      }

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        window.dispatchEvent(new CustomEvent(CTRL_ENTER_EVENT));
      });

      editor.onDidChangeModelContent(() => {
        const v = editor.getValue();
        onChange?.(v);
        triggerValidation(v);
      });

      if (adaptiveHeight) editor.onDidContentSizeChange(updateHeight);
      if (!isEmpty) updateHeight();

      runValidation(currentValue);
      setIsInitialized(true);

      const instance: TMonacoEditorInstance = {
        revealLineInCenter: (line) => editor.revealLineInCenter(line),
        setPosition: (pos) => editor.setPosition(pos),
        focus: () => editor.focus(),
      };
      setNavigatorEditorRef(instance);
      onEditorReady?.(instance);
    })();

    return () => {
      disposed = true;
      if (validationTimeoutRef.current)
        clearTimeout(validationTimeoutRef.current);
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, [isClient, language, triggerValidation, runValidation]);

  // Sync external value
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !isInitialized) return;
    if (editor.getValue() !== currentValue) editor.setValue(currentValue);
  }, [currentValue, isInitialized]);

  // Re-apply theme when dark/light changes.
  // When `isDark` is provided, react to prop changes.
  // When `isDark` is undefined, auto-detect via MutationObserver.
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco || !isInitialized || !containerRef.current) return;

    const applyTheme = () => {
      if (!monaco || !containerRef.current) return;
      const theme = buildMonacoThemeFromCSSVars(containerRef.current);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      monaco.editor.defineTheme(MONACO_THEME_BASE, theme as any);
      setThemeRef.current?.(MONACO_THEME_BASE);
    };

    applyTheme();

    // Only observe DOM for auto-detection when isDark is not explicitly controlled
    if (isDark === undefined) {
      const observer = new MutationObserver(applyTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => observer.disconnect();
    }
  }, [isInitialized, isDark]);

  // Sync readonly
  useEffect(() => {
    if (!editorRef.current || !isInitialized) return;
    editorRef.current.updateOptions({ readOnly: isReadonly });
  }, [isReadonly, isInitialized]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentValue.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isClient) return null;

  return (
    <div
      {...htmlProps}
      className={cn(
        'group/code-editor relative flex flex-col',
        bordered && 'rounded-lg border border-border',
        (fill || isEmpty) && 'h-full',
        className
      )}
    >
      {withNavigator && (
        <CodeNavigator
          value={currentValue}
          language={language}
          editorRef={navigatorEditorRef}
        />
      )}
      <div className={cn('relative', fill && 'min-h-0 flex-1')}>
        <div
          ref={containerRef}
          style={{ height: getHeightStyle(fill, adaptiveHeight, height) }}
          className={cn(
            'w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            (fill || isEmpty) && 'h-full'
          )}
        />

        {canCopy && !isEmpty && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:text-foreground group-hover/code-editor:opacity-100"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export {
  CodeEditor,
  type TCodeEditorProps,
  type TDiagnostic,
  type TDiagnosticsConfig,
  type TMonacoEditorInstance,
};
