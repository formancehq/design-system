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
import {
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyP,
  TypographyInlineCode,
} from '@/registry/default/ui/typography';
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
import { AppCard } from '@/components/ui-fragments/app-card';
import { AppCardEmpty } from '@/components/ui-fragments/app-card-empty';

type TMdxHeadingLevel = 2 | 3 | 4 | 5;

const headingByLevel = {
  2: TypographyH2,
  3: TypographyH3,
  4: TypographyH4,
  5: TypographyH5,
} as const;

function MdxHeading({
  level,
  ...props
}: React.ComponentProps<'h2'> & { level: TMdxHeadingLevel }) {
  const text = typeof props.children === 'string' ? props.children : '';
  const id = slugify(text);
  const Heading = headingByLevel[level];

  return (
    <Heading id={id} className="group" {...props}>
      <a href={`#${id}`} className="no-underline">
        {props.children}
        <span className="ml-2 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors">
          #
        </span>
      </a>
    </Heading>
  );
}

type TSectionProps = {
  title: string;
  description?: React.ReactNode;
  level?: TMdxHeadingLevel;
  children?: React.ReactNode;
};

function Section({ title, description, level = 2, children }: TSectionProps) {
  const id = slugify(title);
  const Heading = headingByLevel[level];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading id={id} className="group">
          <a href={`#${id}`} className="no-underline">
            {title}
            <span className="ml-2 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-colors">
              #
            </span>
          </a>
        </Heading>
        {description && <TypographyP>{description}</TypographyP>}
      </div>
      {children}
    </section>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => <MdxHeading level={2} {...props} />,
  h3: (props) => <MdxHeading level={3} {...props} />,
  h4: (props) => <MdxHeading level={4} {...props} />,
  h5: (props) => <MdxHeading level={5} {...props} />,
  p: (props) => <TypographyP {...props} />,
  code: ({ children, className, ...props }) => {
    const isBlock = className?.startsWith('language-');

    return isBlock ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <TypographyInlineCode className={className} {...props}>
        {children}
      </TypographyInlineCode>
    );
  },
  pre: ({ children }: React.ComponentProps<'pre'>) => {
    if (
      isValidElement<{ className?: string; children?: React.ReactNode }>(
        children
      )
    ) {
      const className = children.props.className ?? '';
      const lang = className.replace(
        'language-',
        ''
      ) as TCodeSnippetProps['language'];
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
  Section,
};
