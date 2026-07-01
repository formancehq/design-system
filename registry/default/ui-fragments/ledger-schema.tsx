'use client';

/**
 * LedgerSchema — interactive viewer for a Formance ledger schema.
 *
 * Renders the three parts of a ledger schema — chart of accounts,
 * transactions (Numscript), and queries — in one component, with a tabbed
 * full view plus narrowing props to show a single section, a single
 * transaction, or a single chart subtree.
 *
 *   <LedgerSchema data={schema} />                          full tabbed view
 *   <LedgerSchema data={schema} section="chart" />          just the chart
 *   <LedgerSchema data={schema} tx="CLIENT_DEPOSIT" />      a single transaction
 *   <LedgerSchema data={schema} chart="banks" />            a single chart subtree
 *
 * Data-driven: the schema is passed as a parsed object, not loaded by name.
 * Interpreter / feature-flag pills are predicted from the Numscript source
 * (see `_ledger-schema/numscript`); explicit `interpreter`/`featureFlags`
 * fields on a transaction override the prediction. Host-specific tooling
 * (playground launcher, dev debug strip) is injected via the optional
 * `renderScript*` slots.
 */

import { Check, ChevronRight, Copy } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import {
  ChartOfAccounts,
  type TChartOfAccountsProps,
  type TChartSegment,
} from '@/components/ui-fragments/_ledger-schema/chart-of-accounts';
import {
  flagShortName,
  inferFlags,
  inferInterpreter,
  normalizeFlags,
  type TInterpreter,
} from '@/components/ui-fragments/_ledger-schema/numscript';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/registry/default/ui/collapsible';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

export type TLedgerTransaction = {
  description?: string;
  script?: string;
  interpreter?: TInterpreter;
  featureFlags?: string[];
};

export type TLedgerQuery = {
  description?: string;
  resource?: string;
  vars?: unknown;
  params?: unknown;
  body?: unknown;
};

export type TLedgerSchemaData = {
  chart?: Record<string, TChartSegment | null>;
  transactions?: Record<string, TLedgerTransaction>;
  queries?: Record<string, TLedgerQuery>;
};

export type TSchemaTab = 'chart' | 'transactions' | 'queries' | 'yaml' | 'json';

const DEFAULT_TAB_ORDER: TSchemaTab[] = [
  'chart',
  'transactions',
  'queries',
  'yaml',
  'json',
];

type TScriptSlots = {
  renderScriptTags?: (code: string) => ReactNode;
  renderScriptActions?: (code: string) => ReactNode;
  renderScriptFooter?: (code: string) => ReactNode;
};

/**
 * Chart-of-accounts display controls forwarded verbatim to the chart view —
 * the single chart subtree, `section="chart"`, and the full view's chart tab.
 * Picked from the chart's own props so the surface stays in sync; all flat and
 * optional, so they're authorable as MDX attributes (e.g. `legend hideToolbar`).
 */
type TChartViewProps = Pick<
  TChartOfAccountsProps,
  | 'defaultOpenDepth'
  | 'defaultExpanded'
  | 'defaultShowDetails'
  | 'hideToolbar'
  | 'legend'
>;

export type TLedgerSchemaProps = {
  data: TLedgerSchemaData;
  /** Show a single section without the tab bar. */
  section?: 'chart' | 'transactions' | 'queries';
  /** Show only this transaction. */
  tx?: string;
  /** Show only this query. */
  query?: string;
  /** Show only this top-level chart subtree. */
  chart?: string;
  /** Pre-stringified YAML source; enables the "yaml" tab in the full view. */
  yaml?: string;
  /**
   * Tabs to show in the full view, in order. A tab appears only if its data is
   * present (chart/transactions/queries), `yaml` is provided (yaml), or there is
   * any content (json). Defaults to all available sections followed by json.
   */
  tabs?: TSchemaTab[];
  /** Initially-selected tab in the full view; falls back to the first shown tab. */
  defaultTab?: TSchemaTab;
  className?: string;
} & TChartViewProps &
  TScriptSlots;

const cardClass =
  'not-prose w-full overflow-hidden rounded-md border bg-card text-card-foreground';

export function LedgerSchema({
  data,
  section,
  tx,
  query,
  chart,
  yaml,
  tabs,
  defaultTab,
  defaultOpenDepth,
  defaultExpanded,
  defaultShowDetails,
  hideToolbar,
  legend,
  className,
  renderScriptTags,
  renderScriptActions,
  renderScriptFooter,
}: TLedgerSchemaProps) {
  const slots: TScriptSlots = {
    renderScriptTags,
    renderScriptActions,
    renderScriptFooter,
  };
  const chartProps: TChartViewProps = {
    defaultOpenDepth,
    defaultExpanded,
    defaultShowDetails,
    hideToolbar,
    legend,
  };

  if (tx && data.transactions?.[tx]) {
    return (
      <TransactionCard
        name={tx}
        tx={data.transactions[tx]}
        slots={slots}
        foldable={false}
        className={className}
      />
    );
  }

  if (query && data.queries?.[query]) {
    return (
      <QueryCard
        name={query}
        query={data.queries[query]}
        foldable={false}
        className={className}
      />
    );
  }

  if (chart && data.chart && Object.hasOwn(data.chart, chart)) {
    return (
      <ChartOfAccounts
        data={{ [chart]: data.chart[chart] ?? null }}
        {...chartProps}
        className={className}
      />
    );
  }

  if (section === 'chart' && data.chart) {
    return (
      <ChartOfAccounts
        data={data.chart}
        {...chartProps}
        className={className}
      />
    );
  }

  if (section === 'transactions' && data.transactions) {
    return (
      <div className={cn(cardClass, 'p-3', className)}>
        <TransactionsView transactions={data.transactions} slots={slots} />
      </div>
    );
  }

  if (section === 'queries' && data.queries) {
    return (
      <div className={cn(cardClass, 'p-3', className)}>
        <QueriesView queries={data.queries} />
      </div>
    );
  }

  return (
    <FullSchemaView
      data={data}
      yaml={yaml}
      tabs={tabs}
      defaultTab={defaultTab}
      chartProps={chartProps}
      className={className}
      slots={slots}
    />
  );
}

// ── Full tabbed view ────────────────────────────────────────

function FullSchemaView({
  data,
  yaml,
  tabs,
  defaultTab,
  chartProps,
  className,
  slots,
}: {
  data: TLedgerSchemaData;
  yaml?: string;
  tabs?: TSchemaTab[];
  defaultTab?: TSchemaTab;
  chartProps: TChartViewProps;
  className?: string;
  slots: TScriptSlots;
}) {
  const hasContent = !!(data.chart || data.transactions || data.queries);
  const available = new Set<TSchemaTab>();
  if (data.chart) available.add('chart');
  if (data.transactions) available.add('transactions');
  if (data.queries) available.add('queries');
  if (yaml?.trim()) available.add('yaml');
  if (hasContent) available.add('json');

  const shown = (tabs ?? DEFAULT_TAB_ORDER).filter((t) => available.has(t));

  if (shown.length === 0) {
    return (
      <div
        className={cn(
          cardClass,
          'p-8 text-center text-muted-foreground',
          className
        )}
      >
        No schema content.
      </div>
    );
  }

  const isSingleTab = shown.length === 1;
  const initialTab =
    defaultTab && shown.includes(defaultTab) ? defaultTab : shown[0];
  const counts: Record<string, number | undefined> = {
    transactions: data.transactions
      ? Object.keys(data.transactions).length
      : undefined,
    queries: data.queries ? Object.keys(data.queries).length : undefined,
  };

  return (
    <div className={cn(cardClass, className)}>
      <Tabs defaultValue={initialTab} className="gap-0">
        <div className="flex items-center border-b bg-muted/40 pr-2">
          <TabsList variant="line" className="-ml-px px-2 pl-0">
            {shown.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className={isSingleTab ? 'after:hidden' : undefined}
              >
                {t}
                {counts[t] != null && (
                  <span className="rounded-full bg-foreground/10 px-1.5 text-[10px] font-normal tabular-nums">
                    {counts[t]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {shown.includes('yaml') && yaml?.trim() && (
            <CopyButton text={yaml.trim()} label="Copy" className="ml-auto" />
          )}
        </div>

        {shown.includes('chart') && data.chart && (
          <TabsContent value="chart" className="p-0">
            <ChartOfAccounts
              data={data.chart}
              {...chartProps}
              className="rounded-none border-0 bg-transparent"
            />
          </TabsContent>
        )}
        {shown.includes('transactions') && data.transactions && (
          <TabsContent value="transactions" className="p-2">
            <TransactionsView transactions={data.transactions} slots={slots} />
          </TabsContent>
        )}
        {shown.includes('queries') && data.queries && (
          <TabsContent value="queries" className="p-2">
            <QueriesView queries={data.queries} />
          </TabsContent>
        )}
        {shown.includes('yaml') && yaml?.trim() && (
          <TabsContent value="yaml" className="p-0">
            <CodeSnippet code={yaml.trim()} language="yaml" bordered={false} />
          </TabsContent>
        )}
        {shown.includes('json') && hasContent && (
          <TabsContent value="json" className="p-0">
            <CodeSnippet
              code={JSON.stringify(data, null, 2)}
              language="json"
              bordered={false}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// ── Transactions ────────────────────────────────────────────

function TransactionsView({
  transactions,
  slots,
}: {
  transactions: Record<string, TLedgerTransaction>;
  slots: TScriptSlots;
}) {
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(transactions).map(([name, tx]) => (
        <TransactionCard key={name} name={name} tx={tx} slots={slots} />
      ))}
    </div>
  );
}

function TransactionCard({
  name,
  tx,
  slots,
  foldable,
  className,
}: {
  name: string;
  tx: TLedgerTransaction;
  slots: TScriptSlots;
  foldable?: boolean;
  className?: string;
}) {
  const code = tx.script?.trim() ?? '';

  return (
    <SchemaCard
      name={name}
      badges={
        code ? (
          <ScriptTags code={code} tx={tx} render={slots.renderScriptTags} />
        ) : null
      }
      description={tx.description}
      actions={
        code ? (
          <>
            {slots.renderScriptActions?.(code)}
            <CopyButton text={code} />
          </>
        ) : null
      }
      code={code}
      language="numscript"
      footer={code ? slots.renderScriptFooter?.(code) : null}
      foldable={foldable}
      className={className}
    />
  );
}

/**
 * Card shared by transactions and queries: name + badges on the title row,
 * description below it, and a code block. In a list (`foldable`) the title row
 * is a fold trigger with a chevron and the code collapses; for a single item
 * it renders flat with no chevron and the code always shown.
 */
function SchemaCard({
  name,
  badges,
  description,
  actions,
  code,
  language,
  footer,
  defaultOpen = true,
  foldable = true,
  className,
}: {
  name: string;
  badges?: ReactNode;
  description?: string;
  actions?: ReactNode;
  code: string;
  language: 'numscript' | 'json';
  footer?: ReactNode;
  defaultOpen?: boolean;
  foldable?: boolean;
  className?: string;
}) {
  const titleColumn = (
    <div className="min-w-0 flex-1 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm font-semibold text-foreground">
          {name}
        </span>
        {badges}
      </div>
      {description && (
        <div className="pb-2 text-xs text-muted-foreground">
          {description.replace(/\s+/g, ' ').trim()}
        </div>
      )}
    </div>
  );

  const codeBlock = code && (
    <div className="border-t">
      <CodeSnippet
        code={code}
        language={language}
        bordered={false}
        canCopy={false}
      />
      {footer}
    </div>
  );

  const actionsCluster = actions && (
    <div className="flex shrink-0 items-center gap-1">{actions}</div>
  );

  const cardClassName = cn(
    'overflow-hidden rounded-md border bg-card',
    className
  );

  if (!foldable || !code) {
    return (
      <div className={cardClassName}>
        <div className="flex items-start gap-2 px-2 pt-2">
          {titleColumn}
          {actionsCluster}
        </div>
        {codeBlock}
      </div>
    );
  }

  return (
    <Collapsible defaultOpen={defaultOpen} className={cardClassName}>
      <div className="flex items-start gap-2 px-2 pt-2">
        <CollapsibleTrigger className="group flex min-w-0 flex-1 items-start gap-2 text-left">
          <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
          {titleColumn}
        </CollapsibleTrigger>
        {actionsCluster}
      </div>
      {code && <CollapsibleContent>{codeBlock}</CollapsibleContent>}
    </Collapsible>
  );
}

function ScriptTags({
  code,
  tx,
  render,
}: {
  code: string;
  tx: TLedgerTransaction;
  render?: (code: string) => ReactNode;
}) {
  if (render) return <>{render(code)}</>;

  const flags = tx.featureFlags
    ? normalizeFlags(tx.featureFlags)
    : inferFlags(code);
  const interpreter = tx.interpreter ?? inferInterpreter(flags);

  return (
    <span className="flex shrink-0 flex-wrap items-center gap-1">
      <Badge
        variant={interpreter === 'experimental' ? 'amber' : 'secondary'}
        size="sm"
      >
        {interpreter}
      </Badge>
      {flags.map((f) => (
        <Badge key={f} variant="violet" size="sm" className="normal-case">
          {flagShortName(f)}
        </Badge>
      ))}
    </span>
  );
}

// ── Queries ─────────────────────────────────────────────────

function QueriesView({ queries }: { queries: Record<string, TLedgerQuery> }) {
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(queries).map(([name, q]) => (
        <QueryCard key={name} name={name} query={q} />
      ))}
    </div>
  );
}

function QueryCard({
  name,
  query,
  foldable,
  className,
}: {
  name: string;
  query: TLedgerQuery;
  foldable?: boolean;
  className?: string;
}) {
  const body = query.body != null ? JSON.stringify(query.body, null, 2) : '';

  return (
    <SchemaCard
      name={name}
      badges={
        query.resource ? (
          <Badge variant="secondary" size="sm">
            {query.resource}
          </Badge>
        ) : null
      }
      description={query.description}
      actions={body ? <CopyButton text={body} /> : null}
      code={body}
      language="json"
      foldable={foldable}
      className={className}
    />
  );
}

// ── Copy button ─────────────────────────────────────────────
// Matches the design-system outline icon button used by ApiSnippet, so the
// copy / play actions read consistently across both fragments.

function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size={label ? 'sm' : 'icon-sm'}
      aria-label="Copy"
      className={cn(
        'text-muted-foreground',
        label && 'gap-1.5 [&>svg]:size-3.5',
        className
      )}
      onClick={async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(text.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check /> : <Copy />}
      {label && <span>{copied ? 'Copied' : label}</span>}
    </Button>
  );
}
