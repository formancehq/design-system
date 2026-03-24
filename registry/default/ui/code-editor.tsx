'use client';

import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import {
  buildMonacoThemeFromCSSVars,
  CODE_LANGUAGES,
  cssVarsTheme,
  getHighlighter,
  MONACO_EDITOR_OPTIONS,
  setupMonacoEnvironment,
  type TCodeLanguage,
} from '@/registry/default/ui/code-themes';

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
  diagnostics?: TDiagnosticsConfig;
  onEditorReady?: (editor: TMonacoEditorInstance) => void;
  className?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEVERITY_MAP = { error: 8, warning: 4, info: 2, hint: 1 } as const;
const VALIDATION_DEBOUNCE_MS = 500;
const CTRL_ENTER_EVENT = 'formance:code-editor:ctrl-enter';
const MONACO_THEME_NAME = 'formance-css-vars';

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
  diagnostics,
  onEditorReady,
  className,
}: TCodeEditorProps) {
  const adaptiveHeight = !fill && adaptiveHeightProp;

  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const diagnosticsRef = useRef(diagnostics);

  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [copied, setCopied] = useState(false);

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
      const monaco = await import('monaco-editor');
      const { shikiToMonaco } = await import('@shikijs/monaco');

      setupMonacoEnvironment();

      const highlighter = await getHighlighter();

      // Register languages
      CODE_LANGUAGES.forEach((lang) => {
        monaco.languages.register({ id: lang });
      });

      // Wire Shiki tokenization into Monaco
      shikiToMonaco(highlighter, monaco);

      if (disposed || !containerRef.current) return;
      monacoRef.current = monaco;

      // Build theme from CSS variables
      const theme = buildMonacoThemeFromCSSVars(containerRef.current);
      monaco.editor.defineTheme(
        MONACO_THEME_NAME,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        theme as any
      );

      const editor = monaco.editor.create(containerRef.current, {
        ...MONACO_EDITOR_OPTIONS,
        value: currentValue,
        language,
        theme: MONACO_THEME_NAME,
        readOnly: isReadonly,
      });

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

  // Re-apply theme when dark/light changes
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco || !isInitialized || !containerRef.current) return;

    const theme = buildMonacoThemeFromCSSVars(containerRef.current);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    monaco.editor.defineTheme(MONACO_THEME_NAME, theme as any);
    monaco.editor.setTheme(MONACO_THEME_NAME);
  });

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
      className={cn(
        'group/code-editor relative flex flex-col',
        bordered && 'rounded-lg border border-border',
        (fill || isEmpty) && 'h-full',
        className
      )}
    >
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
