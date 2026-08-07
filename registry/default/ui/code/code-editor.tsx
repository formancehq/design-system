'use client';

import { Check, Copy } from 'lucide-react';
import type React from 'react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/default/ui/button';
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
  onDidPaste?: (value: string) => void;
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
  monaco: any;
  /** Original setTheme before shikiToMonaco's override */
  setTheme: (name: string) => void;
};

let _monacoSetupPromise: Promise<TMonacoSetupResult> | null = null;

// Monaco only runs in the browser, so the editor is gated on hydration.
const subscribeToNothing = () => () => {};
const getIsClientSnapshot = () => true;
const getIsServerSnapshot = () => false;

function ensureMonacoSetup(): Promise<TMonacoSetupResult> {
  if (_monacoSetupPromise) return _monacoSetupPromise;

  _monacoSetupPromise = (async () => {
    const [monaco, { shikiToMonaco }] = await Promise.all([
      import('monaco-editor-core'),
      import('@shikijs/monaco'),
    ]);

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

type TUseMonacoThemeArgs = {
  isInitialized: boolean;
  isDark?: boolean;
  monacoRef: React.RefObject<any>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setThemeRef: React.RefObject<((name: string) => void) | null>;
};

/**
 * Re-applies the theme when dark/light changes. When `isDark` is provided it
 * reacts to prop changes; when it is undefined the document class is observed.
 */
function useMonacoTheme({
  isInitialized,
  isDark,
  monacoRef,
  containerRef,
  setThemeRef,
}: TUseMonacoThemeArgs) {
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco || !isInitialized || !containerRef.current) return;

    const applyTheme = () => {
      if (!monaco || !containerRef.current) return;
      const theme = buildMonacoThemeFromCSSVars(containerRef.current);

      monaco.editor.defineTheme(MONACO_THEME_BASE, theme as any);
      setThemeRef.current?.(MONACO_THEME_BASE);
    };

    applyTheme();

    if (isDark === undefined) {
      const observer = new MutationObserver(applyTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => observer.disconnect();
    }
  }, [isInitialized, isDark, monacoRef, containerRef, setThemeRef]);
}

function CodeEditor({
  value,
  defaultValue,
  language,
  onChange,
  height = 400,
  isReadonly = false,
  canCopy = true,
  onCtrlEnter,
  onDidPaste,
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

  const editorRef = useRef<any>(null);

  const monacoRef = useRef<any>(null);
  const setThemeRef = useRef<((name: string) => void) | null>(null);
  const validationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const diagnosticsRef = useRef(diagnostics);
  const onDidPasteRef = useRef(onDidPaste);
  const onCtrlEnterRef = useRef(onCtrlEnter);

  const isClient = useSyncExternalStore(
    subscribeToNothing,
    getIsClientSnapshot,
    getIsServerSnapshot
  );
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

  useEffect(() => {
    onDidPasteRef.current = onDidPaste;
  }, [onDidPaste]);

  useEffect(() => {
    onCtrlEnterRef.current = onCtrlEnter;
  }, [onCtrlEnter]);

  useEffect(() => {
    const handleCtrlEnter = () => onCtrlEnterRef.current?.();
    window.addEventListener(CTRL_ENTER_EVENT, handleCtrlEnter);

    return () => window.removeEventListener(CTRL_ENTER_EVENT, handleCtrlEnter);
  }, []);

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
    const markers = results.map((d: TDiagnostic) => ({
      startLineNumber: d.startLineNumber,
      startColumn: d.startColumn,
      endLineNumber: d.endLineNumber,
      endColumn: d.endColumn,
      message: d.message,
      severity: SEVERITY_MAP[d.severity],
    }));

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

  const setupValues = useRef({
    currentValue,
    isReadonly,
    defaultUnfoldAll,
    onChange,
    adaptiveHeight,
    updateHeight,
    isEmpty,
    onEditorReady,
  });

  useEffect(() => {
    setupValues.current = {
      currentValue,
      isReadonly,
      defaultUnfoldAll,
      onChange,
      adaptiveHeight,
      updateHeight,
      isEmpty,
      onEditorReady,
    };
  });

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    let disposed = false;

    (async () => {
      const { monaco, setTheme } = await ensureMonacoSetup();

      if (disposed || !containerRef.current) return;
      monacoRef.current = monaco;
      setThemeRef.current = setTheme;

      const {
        currentValue: initialValue,
        isReadonly: readOnly,
        defaultUnfoldAll: unfoldAll,
        adaptiveHeight: withAdaptiveHeight,
        updateHeight: applyHeight,
        isEmpty: startsEmpty,
        onEditorReady: notifyEditorReady,
      } = setupValues.current;

      // Create the editor with the Shiki-compatible fallback theme.
      // shikiToMonaco intercepts create() and calls its own setTheme()
      // which needs real hex colors in the Shiki color map.
      const editor = monaco.editor.create(containerRef.current, {
        ...MONACO_EDITOR_OPTIONS,
        value: initialValue,
        language,
        theme: 'formance-monaco-fallback',
        readOnly,
      });

      // Apply the resolved CSS-variables theme for proper brand colors.
      const resolvedTheme = buildMonacoThemeFromCSSVars(containerRef.current);
      monaco.editor.defineTheme(
        MONACO_THEME_BASE,

        resolvedTheme as any
      );
      setTheme(MONACO_THEME_BASE);

      if (disposed) {
        editor.dispose();

        return;
      }

      editorRef.current = editor;

      if (!unfoldAll) {
        editor.getAction('editor.foldAll')?.run();
      }

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        window.dispatchEvent(new CustomEvent(CTRL_ENTER_EVENT));
      });

      editor.onDidChangeModelContent(() => {
        const v = editor.getValue();
        setupValues.current.onChange?.(v);
        triggerValidation(v);
      });

      editor.onDidPaste(() => {
        onDidPasteRef.current?.(editor.getValue());
      });

      if (withAdaptiveHeight) {
        editor.onDidContentSizeChange(() => setupValues.current.updateHeight());
      }
      if (!startsEmpty) applyHeight();

      runValidation(initialValue);
      setIsInitialized(true);

      const instance: TMonacoEditorInstance = {
        revealLineInCenter: (line) => editor.revealLineInCenter(line),
        setPosition: (pos) => editor.setPosition(pos),
        focus: () => editor.focus(),
      };
      setNavigatorEditorRef(instance);
      notifyEditorReady?.(instance);
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

  useMonacoTheme({
    isInitialized,
    isDark,
    monacoRef,
    containerRef,
    setThemeRef,
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
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Copy code"
            onClick={handleCopy}
            className="absolute right-3 top-3 bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover/code-editor:opacity-100"
          >
            {copied ? <Check /> : <Copy />}
          </Button>
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
