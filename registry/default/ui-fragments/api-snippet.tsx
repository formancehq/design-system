'use client';

import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import stackOperationsData from '@/registry/default/lib/stack-operations.json';
import {
  generateCurl,
  generateHttpie,
  generateSdk,
  resolvePathParams,
  type TStackOperation,
  type TStackOperationsIndex,
} from '@/components/ui-fragments/_api-snippet/generators';
import { Button } from '@/registry/default/ui/button';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';
import { Endpoint } from '@/registry/default/ui/endpoint';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

const stackOperations = (stackOperationsData as TStackOperationsIndex)
  .operations;

export type TApiSnippetTab = 'curl' | 'httpie' | 'sdk' | 'fctl';

const TAB_LABEL: Record<TApiSnippetTab, string> = {
  curl: 'curl',
  httpie: 'HTTPie',
  sdk: 'TypeScript',
  fctl: 'fctl',
};

const TAB_LANGUAGE: Record<TApiSnippetTab, 'bash' | 'typescript'> = {
  curl: 'bash',
  httpie: 'bash',
  sdk: 'typescript',
  fctl: 'bash',
};

export type TApiSnippetProps = {
  /**
   * OpenAPI operationId, resolved against the `operations` index. Optional —
   * omit it to render an fctl-only snippet (`tabs={['fctl']}`) with no
   * generated request and no endpoint footer.
   */
  operation?: string;
  /**
   * Operations index the `operation` is resolved against. Defaults to the
   * bundled stack operations. Pass a different index (e.g. membership/cloud
   * operations) to generate snippets for another API.
   */
  operations?: Record<string, TStackOperation>;
  /**
   * HTTP method, used directly instead of resolving from `operation`. Takes
   * precedence over the resolved operation's method when both are provided.
   */
  method?: string;
  /**
   * API path, used directly instead of resolving from `operation`. May include
   * a query string (`?a=b`). Takes precedence over the resolved operation's path.
   */
  path?: string;
  /** Path parameter values, e.g. `{ ledger: 'testing' }`. */
  params?: Record<string, string>;
  /** Request body. JSON-serialized for curl/sdk, flattened to key=value for HTTPie. */
  body?: Record<string, unknown>;
  /**
   * Reference the request body from a file instead of inlining it
   * (`curl -d @file.json`, `http < file.json`). Takes precedence over `body`
   * for the curl/HTTPie tabs.
   */
  bodyFile?: string;
  /** Extra raw args appended to the generated curl/HTTPie command. */
  rawArgs?: string;
  /** Extra request headers. */
  headers?: Record<string, string>;
  /** Override the base URL placeholder. */
  baseUrl?: string;
  /** fctl one-liner. Required for the `fctl` tab to render. */
  fctl?: string;
  /**
   * Which tabs to show, in order. Defaults to `['curl', 'httpie', 'sdk']`,
   * with `'fctl'` prepended when a `fctl` string is provided. A requested tab
   * is only rendered when it has content (`'fctl'` needs the `fctl` prop,
   * `'sdk'` needs the operation to declare an SDK module/method).
   */
  tabs?: TApiSnippetTab[];
  /** Initial tab (uncontrolled). Falls back to the first visible tab when not shown. */
  defaultTab?: TApiSnippetTab;
  /**
   * Controlled active tab. When provided, the component does not manage tab
   * state internally — pair with `onValueChange` to drive it from the host
   * (e.g. to persist the curl/HTTPie choice across snippets).
   */
  value?: TApiSnippetTab;
  /** Called with the selected tab whenever the user switches tabs. */
  onValueChange?: (tab: TApiSnippetTab) => void;
  /**
   * Cap the visible height of the code area. When true, long snippets scroll
   * inside the box instead of expanding the parent layout.
   */
  clipCodeHeight?: boolean;
  className?: string;
};

const CLIPPED_CODE_HEIGHT = 240;

export function ApiSnippet({
  operation,
  operations = stackOperations,
  method: methodProp,
  path: pathProp,
  params,
  body,
  bodyFile,
  rawArgs,
  headers,
  baseUrl,
  fctl,
  tabs,
  defaultTab = 'curl',
  value,
  onValueChange,
  clipCodeHeight = false,
  className,
}: TApiSnippetProps) {
  const codeStyle = clipCodeHeight
    ? { maxHeight: CLIPPED_CODE_HEIGHT }
    : undefined;
  const codeClassName = clipCodeHeight ? 'm-0 overflow-y-auto' : 'm-0';
  const op = operation
    ? (operations[operation] as TStackOperation | undefined)
    : undefined;
  const hasRequest = !!op || !!methodProp || !!pathProp;
  const method = methodProp ?? op?.method ?? 'GET';
  const rawPath = pathProp ?? op?.path ?? '';
  const resolvedPath = resolvePathParams(rawPath, params);

  const curl = useMemo(
    () =>
      generateCurl(
        method,
        resolvedPath,
        body,
        headers,
        baseUrl,
        bodyFile,
        rawArgs
      ),
    [method, resolvedPath, body, headers, baseUrl, bodyFile, rawArgs]
  );
  const httpie = useMemo(
    () =>
      generateHttpie(
        method,
        resolvedPath,
        body,
        headers,
        baseUrl,
        bodyFile,
        rawArgs
      ),
    [method, resolvedPath, body, headers, baseUrl, bodyFile, rawArgs]
  );
  const sdk = useMemo(
    () => (op ? generateSdk(op, params, body) : ''),
    [op, params, body]
  );

  const hasContent: Record<TApiSnippetTab, boolean> = {
    curl: hasRequest,
    httpie: hasRequest,
    sdk: !!op?.sdk,
    fctl: !!fctl,
  };
  const requestedTabs =
    tabs ??
    (fctl ? ['fctl', 'curl', 'httpie', 'sdk'] : ['curl', 'httpie', 'sdk']);
  const visibleTabs = requestedTabs.filter((t) => hasContent[t]);
  const isSingleTab = visibleTabs.length === 1;
  const initialTab = visibleTabs.includes(defaultTab)
    ? defaultTab
    : (visibleTabs[0] ?? 'curl');
  const [internalTab, setInternalTab] = useState<TApiSnippetTab>(initialTab);
  const currentTab = value ?? internalTab;
  const activeTab = visibleTabs.includes(currentTab)
    ? currentTab
    : (visibleTabs[0] ?? 'curl');
  const handleTabChange = (next: TApiSnippetTab) => {
    if (value === undefined) setInternalTab(next);
    onValueChange?.(next);
  };

  if (visibleTabs.length === 0) {
    if (operation && !op) {
      return (
        <div
          className={cn(
            'rounded-md border border-destructive/40 bg-destructive/10 p-3 font-mono text-xs text-destructive-foreground',
            className
          )}
        >
          Unknown operation: <code>{operation}</code>
        </div>
      );
    }

    return null;
  }

  const codeByTab: Record<TApiSnippetTab, string> = {
    curl,
    httpie,
    sdk,
    fctl: fctl ?? '',
  };

  return (
    <div
      className={cn(
        'not-prose w-full overflow-hidden rounded-md border bg-card text-card-foreground',
        className
      )}
    >
      <Tabs
        value={activeTab}
        onValueChange={(v) => handleTabChange(v as TApiSnippetTab)}
        className="gap-0"
      >
        <div className="flex items-center border-b bg-muted/40 pr-2">
          <TabsList variant="line" className="px-2 pl-0 -ml-px">
            {visibleTabs.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className={isSingleTab ? 'after:hidden' : undefined}
              >
                {TAB_LABEL[t]}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyButton text={codeByTab[activeTab]} className="ml-auto" />
        </div>
        {visibleTabs.map((t) => (
          <TabsContent
            key={t}
            value={t}
            className={codeClassName}
            style={codeStyle}
          >
            <CodeSnippet
              code={codeByTab[t]}
              language={TAB_LANGUAGE[t]}
              bordered={false}
              canCopy={false}
            />
          </TabsContent>
        ))}
      </Tabs>
      {hasRequest && (
        <div className="flex items-center border-t p-2">
          <Endpoint method={method} path={resolvedPath.split('?')[0]} />
        </div>
      )}
    </div>
  );
}

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      aria-label="Copy"
      className={cn('text-muted-foreground', className)}
      onClick={async () => {
        await navigator.clipboard.writeText(text.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
