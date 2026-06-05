'use client';

import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { BadgeMethod } from '@/registry/default/ui/badge-method';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';
import stackOperationsData from '@/registry/default/data/stack-operations.json';
import {
  generateCurl,
  generateHttpie,
  generateSdk,
  resolvePathParams,
  type TStackOperation,
  type TStackOperationsIndex,
} from '@/registry/default/fragments/_api-snippet/generators';

const operations = (stackOperationsData as TStackOperationsIndex).operations;

export type TApiSnippetTab = 'curl' | 'httpie' | 'sdk' | 'fctl';

export type TApiSnippetProps = {
  /** OpenAPI operationId, resolved against the bundled stack operations index. */
  operation: string;
  /** Path parameter values, e.g. `{ ledger: 'testing' }`. */
  params?: Record<string, string>;
  /** Request body. JSON-serialized for curl/sdk, flattened to key=value for HTTPie. */
  body?: Record<string, unknown>;
  /** Extra request headers. */
  headers?: Record<string, string>;
  /** Override the base URL placeholder. */
  baseUrl?: string;
  /** Optional fctl one-liner. When present, an fctl tab is shown. */
  fctl?: string;
  /** Hide the fctl tab even if a fctl prop is provided. */
  noFctl?: boolean;
  /** Initial tab. Defaults to `curl`. */
  defaultTab?: TApiSnippetTab;
  className?: string;
};

export function ApiSnippet({
  operation,
  params,
  body,
  headers,
  baseUrl,
  fctl,
  noFctl,
  defaultTab = 'curl',
  className,
}: TApiSnippetProps) {
  const op = operations[operation] as TStackOperation | undefined;
  const method = op?.method ?? 'GET';
  const rawPath = op?.path ?? '';
  const resolvedPath = resolvePathParams(rawPath, params);
  const showFctl = !noFctl && !!fctl;

  const curl = useMemo(
    () => generateCurl(method, resolvedPath, body, headers, baseUrl),
    [method, resolvedPath, body, headers, baseUrl]
  );
  const httpie = useMemo(
    () => generateHttpie(method, resolvedPath, body, headers, baseUrl),
    [method, resolvedPath, body, headers, baseUrl]
  );
  const sdk = useMemo(
    () => (op ? generateSdk(op, params, body) : ''),
    [op, params, body]
  );

  const initialTab: TApiSnippetTab =
    defaultTab === 'fctl' && !showFctl ? 'curl' : defaultTab;
  const [tab, setTab] = useState<TApiSnippetTab>(initialTab);

  if (!op) {
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
        value={tab}
        onValueChange={(v) => setTab(v as TApiSnippetTab)}
        className="gap-0"
      >
        <div className="flex items-center border-b bg-muted/40 pr-2">
          <TabsList variant="line" className="px-2">
            {showFctl && <TabsTrigger value="fctl">fctl</TabsTrigger>}
            <TabsTrigger value="curl">curl</TabsTrigger>
            <TabsTrigger value="httpie">HTTPie</TabsTrigger>
            <TabsTrigger value="sdk">TypeScript</TabsTrigger>
          </TabsList>
          <CopyButton text={codeByTab[tab]} className="ml-auto" />
        </div>
        <TabsContent value="curl" className="m-0">
          <CodeSnippet
            code={curl}
            language="bash"
            bordered={false}
            canCopy={false}
          />
        </TabsContent>
        <TabsContent value="httpie" className="m-0">
          <CodeSnippet
            code={httpie}
            language="bash"
            bordered={false}
            canCopy={false}
          />
        </TabsContent>
        <TabsContent value="sdk" className="m-0">
          <CodeSnippet
            code={sdk}
            language="typescript"
            bordered={false}
            canCopy={false}
          />
        </TabsContent>
        {showFctl && (
          <TabsContent value="fctl" className="m-0">
            <CodeSnippet
              code={fctl!}
              language="bash"
              bordered={false}
              canCopy={false}
            />
          </TabsContent>
        )}
      </Tabs>
      <div className="flex items-center gap-2 border-t bg-muted/40 px-3 py-1.5">
        <BadgeMethod method={op.method} size="sm" />
        <span className="truncate font-mono text-xs text-foreground">
          {resolvedPath.split('?')[0]}
        </span>
      </div>
    </div>
  );
}

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  
return (
    <button
      type="button"
      aria-label="Copy"
      onClick={async () => {
        await navigator.clipboard.writeText(text.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={cn(
        'inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground',
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
