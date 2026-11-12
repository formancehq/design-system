'use client';

import {
  Children,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/registry/default/ui-fragments/copy-button';
import {
  CodeSnippet,
  type TCodeSnippetProps,
} from '@/registry/default/ui/code/code-snippet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

export type TApiSnippetTabProps = {
  value: string;
  label: ReactNode;
  language: NonNullable<TCodeSnippetProps['language']>;
  code: string;
};

export function ApiSnippetTab(_props: TApiSnippetTabProps) {
  return null;
}

export type TApiSnippetProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  clipCodeHeight?: boolean;
  className?: string;
};

const CLIPPED_CODE_HEIGHT = 240;

export function ApiSnippet({
  children,
  header,
  footer,
  defaultValue,
  value,
  onValueChange,
  clipCodeHeight = false,
  className,
}: TApiSnippetProps) {
  const tabs = Children.toArray(children)
    .filter(
      (child): child is ReactElement<TApiSnippetTabProps> =>
        isValidElement(child) && child.type === ApiSnippetTab
    )
    .map((child) => child.props);
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? tabs[0]?.value
  );
  const activeTab =
    tabs.find((t) => t.value === (value ?? internalValue)) ?? tabs[0];

  if (!activeTab) return null;

  const isSingleTab = tabs.length === 1;
  const handleValueChange = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div
      className={cn(
        'not-prose w-full overflow-hidden rounded-md border bg-card text-card-foreground',
        className
      )}
    >
      {header && <div className="border-b p-2">{header}</div>}
      <Tabs
        value={activeTab.value}
        onValueChange={handleValueChange}
        className="gap-0"
      >
        <div className="flex items-center border-b bg-muted/40 pr-2">
          <TabsList variant="line" className="px-2 pl-0 -ml-px">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={isSingleTab ? 'after:hidden' : undefined}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyButton text={activeTab.code} className="ml-auto" />
        </div>
        {tabs.map((t) => (
          <TabsContent
            key={t.value}
            value={t.value}
            className={clipCodeHeight ? 'm-0 overflow-y-auto' : 'm-0'}
            style={
              clipCodeHeight ? { maxHeight: CLIPPED_CODE_HEIGHT } : undefined
            }
          >
            <CodeSnippet
              code={t.code}
              language={t.language}
              bordered={false}
              canCopy={false}
            />
          </TabsContent>
        ))}
      </Tabs>
      {footer && <div className="flex items-center border-t p-2">{footer}</div>}
    </div>
  );
}
