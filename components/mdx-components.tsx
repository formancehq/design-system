import type { MDXComponents } from 'mdx/types';
import { isValidElement } from 'react';

import { slugify } from '@/lib/slugify';
import { ComponentPreview } from '@/components/component-preview';
import { ComponentSource } from '@/components/component-source';
import { CollapsibleCode } from '@/components/collapsible-code';
import { InstallationTabs } from '@/components/installation-tabs';
import { Steps, Step } from '@/components/steps';
import {
  CodeSnippet,
  type TCodeSnippetProps,
} from '@/registry/default/ui/code/code-snippet';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { Eyebrow } from '@/registry/default/ui/eyebrow';
import {
  BrandSwatches,
  BrandMainVariants,
} from '@/components/docs/brand-swatches';
import { UITokensGrid } from '@/components/docs/ui-tokens-grid';
import { TypefacePreviewCard } from '@/components/docs/typeface-preview-card';
import {
  PolymathPreview,
  BerkeleyMonoPreview,
  FigtreePreview,
  SpaceMonoPreview,
  TypefaceSectionLabel,
  TypographyExampleHero,
  TypographyExampleFeature,
  TypographyExampleCompact,
} from '@/components/docs/typeface-previews';
import {
  LightVariables,
  DarkVariables,
  BrandPaletteVariables,
} from '@/components/docs/theming-code-blocks';
import { AppCard } from '@/registry/default/fragments/app-card';
import { AppCardEmpty } from '@/registry/default/fragments/app-card-empty';

function MdxHeading({
  level,
  ...props
}: React.ComponentProps<'h2'> & { level: 2 | 3 }) {
  const text = typeof props.children === 'string' ? props.children : '';
  const id = slugify(text);
  const Tag = level === 2 ? 'h2' : 'h3';
  const size = level === 2 ? 'text-2xl' : 'text-xl';

  return (
    <Tag
      id={id}
      className={`group scroll-m-20 font-sans ${size} font-semibold tracking-tight`}
      {...props}
    >
      <a href={`#${id}`} className="no-underline">
        {props.children}
        <span className="ml-2 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors">
          #
        </span>
      </a>
    </Tag>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => <MdxHeading level={2} {...props} />,
  h3: (props) => <MdxHeading level={3} {...props} />,
  p: (props) => (
    <p className="text-sm text-muted-foreground leading-relaxed" {...props} />
  ),
  code: ({ children, className, ...props }) => {
    const isBlock = className?.startsWith('language-');

    return isBlock ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }: React.ComponentProps<'pre'>) => {
    if (isValidElement<{ className?: string; children?: React.ReactNode }>(children)) {
      const className = children.props.className ?? '';
      const lang = className.replace('language-', '') as TCodeSnippetProps['language'];
      const code = String(children.props.children ?? '').replace(/\n$/, '');

      return (
        <CodeSnippet
          code={code}
          language={lang || 'plaintext'}
          size="sm"
          bordered
        />
      );
    }

    return <pre>{children}</pre>;
  },
  ComponentPreview,
  ComponentSource,
  CollapsibleCode,
  InstallationTabs,
  Steps,
  Step,
  Tabs,
  TabsContent: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsPrimitive.Content>) => (
    <TabsPrimitive.Content
      forceMount
      className={cn(
        'flex-1 outline-none data-[state=inactive]:hidden',
        className
      )}
      {...props}
    />
  ),
  TabsList,
  TabsTrigger,
  Eyebrow,
  BrandSwatches,
  BrandMainVariants,
  UITokensGrid,
  TypefacePreviewCard,
  PolymathPreview,
  BerkeleyMonoPreview,
  FigtreePreview,
  SpaceMonoPreview,
  TypefaceSectionLabel,
  TypographyExampleHero,
  TypographyExampleFeature,
  TypographyExampleCompact,
  LightVariables,
  DarkVariables,
  BrandPaletteVariables,
  AppCard,
  AppCardEmpty,
};
