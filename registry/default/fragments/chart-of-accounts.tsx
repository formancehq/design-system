'use client';

import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/registry/default/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';

export type TChartSegment = {
  '.self'?: Record<string, never>;
  '.pattern'?: string;
  '.metadata'?: Record<string, { default?: string } | undefined>;
} & {
  [key: string]: unknown;
};

export type TChartOfAccountsProps = {
  data: Record<string, TChartSegment | null>;
  defaultOpenDepth?: number;
  /** Initial fold state. Toolbar can override. */
  defaultExpanded?: boolean;
  /** Initial details visibility. Toolbar can override. */
  defaultShowDetails?: boolean;
  /** Hide the top-right toolbar. */
  hideToolbar?: boolean;
  className?: string;
};

export function ChartOfAccounts({
  data,
  defaultOpenDepth,
  defaultExpanded,
  defaultShowDetails = true,
  hideToolbar = false,
  className,
}: TChartOfAccountsProps) {
  const entries = Object.entries(data);
  const [expanded, setExpanded] = React.useState<boolean | undefined>(
    defaultExpanded
  );
  const [showDetails, setShowDetails] = React.useState(defaultShowDetails);

  return (
    <div
      className={cn(
        'relative rounded-md border bg-card text-card-foreground px-4 py-3 font-mono text-[13px]',
        className
      )}
    >
      {!hideToolbar && (
        <div className="absolute right-2 top-2 flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={showDetails ? 'Hide details' : 'Show details'}
                onClick={() => setShowDetails((v) => !v)}
              >
                {showDetails ? <Eye /> : <EyeOff />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {showDetails ? 'Hide details' : 'Show details'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={expanded === false ? 'Expand all' : 'Collapse all'}
                onClick={() => setExpanded((v) => !(v ?? true))}
              >
                {expanded === false ? <ChevronsUpDown /> : <ChevronsDownUp />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {expanded === false ? 'Expand all' : 'Collapse all'}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      {entries.map(([name, node], i) => (
        <ChartNode
          key={name}
          name={name}
          node={node}
          depth={0}
          prefix=""
          isLast={i === entries.length - 1}
          defaultOpenDepth={defaultOpenDepth}
          expanded={expanded}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
}

type TChartNodeProps = {
  name: string;
  node: TChartSegment | null;
  depth: number;
  prefix: string;
  isLast: boolean;
  defaultOpenDepth?: number;
  expanded?: boolean;
  showDetails: boolean;
};

function ChartNode({
  name,
  node,
  depth,
  prefix,
  isLast,
  defaultOpenDepth,
  expanded,
  showDetails,
}: TChartNodeProps) {
  const entries =
    node && typeof node === 'object'
      ? Object.entries(node as Record<string, unknown>)
      : [];
  const meta = entries.filter(([k]) => k.startsWith('.'));
  const children = entries.filter(([k]) => !k.startsWith('.'));

  const isVariable = name.startsWith('$');
  const isSelf = meta.some(([k]) => k === '.self');
  const pattern = meta.find(([k]) => k === '.pattern')?.[1] as
    | string
    | undefined;
  const metadata = meta.find(([k]) => k === '.metadata')?.[1] as
    | Record<string, { default?: string } | undefined>
    | undefined;

  const hasChildren = children.length > 0;
  const childPrefix = depth === 0 ? '' : prefix + (isLast ? '   ' : '│  ');
  const connector = depth === 0 ? '' : isLast ? '└─ ' : '├─ ';

  const initialOpen =
    expanded != null
      ? expanded
      : defaultOpenDepth != null
        ? depth < defaultOpenDepth
        : true;
  const [open, setOpen] = React.useState(initialOpen);

  React.useEffect(() => {
    if (expanded != null) setOpen(expanded);
  }, [expanded]);

  const labelRow = (
    <div className="flex items-center gap-1.5 py-px">
      {depth > 0 && (
        <span className="select-none whitespace-pre text-muted-foreground/60">
          {prefix}
        </span>
      )}
      {hasChildren ? (
        <CollapsibleTrigger
          aria-label={open ? `Collapse ${name}` : `Expand ${name}`}
          className="-ml-0.5 inline-flex items-center text-muted-foreground/80 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[2px]"
        >
          {open ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
          <span className="select-none whitespace-pre text-muted-foreground/60">
            {depth > 0 ? ' ' : ''}
          </span>
        </CollapsibleTrigger>
      ) : (
        depth > 0 && (
          <span className="select-none whitespace-pre text-muted-foreground/60">
            {connector}
          </span>
        )
      )}
      <span
        className={cn(
          'whitespace-pre',
          isVariable ? 'text-gold-500 dark:text-gold-300' : 'text-foreground'
        )}
      >
        {name}
      </span>
      {showDetails && isSelf && (
        <Badge variant="valid" size="sm">
          account
        </Badge>
      )}
      {showDetails && pattern && (
        <Badge variant="outline" size="sm" className="font-mono normal-case">
          {pattern}
        </Badge>
      )}
      {showDetails && metadata && (
        <span className="inline-flex gap-1">
          {Object.entries(metadata).map(([k, v]) => {
            const def = v?.default;
            if (!def) return null;
            
return (
              <Badge key={k} variant="secondary" size="sm">
                {k}={def}
              </Badge>
            );
          })}
        </span>
      )}
    </div>
  );

  if (!hasChildren) {
    return labelRow;
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      {labelRow}
      <CollapsibleContent>
        {children.map(([key, val], i) => (
          <ChartNode
            key={key}
            name={key}
            node={(val ?? null) as TChartSegment | null}
            depth={depth + 1}
            prefix={childPrefix}
            isLast={i === children.length - 1}
            defaultOpenDepth={defaultOpenDepth}
            expanded={expanded}
            showDetails={showDetails}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
