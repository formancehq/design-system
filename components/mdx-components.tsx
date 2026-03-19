import type { MDXComponents } from 'mdx/types';

import { slugify } from '@/lib/slugify';
import { ComponentPreview } from '@/components/component-preview';
import { ComponentSource } from '@/components/component-source';
import { CodeBlock } from '@/components/code-block';
import { CollapsibleCode } from '@/components/collapsible-code';
import { InstallationTabs } from '@/components/installation-tabs';
import { Steps, Step } from '@/components/steps';
import { MdxCodeBlock } from '@/components/mdx-code-block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import { BrandSwatches } from '@/components/docs/brand-swatches';
import { SemanticColorsGrid } from '@/components/docs/semantic-colors-grid';
import { UITokensGrid } from '@/components/docs/ui-tokens-grid';
import { TypefacePreviews } from '@/components/docs/typeface-previews';
import { LightVariables, DarkVariables, BrandPaletteVariables } from '@/components/docs/theming-code-blocks';

function MdxHeading({ level, ...props }: React.ComponentProps<'h2'> & { level: 2 | 3 }) {
  const text = typeof props.children === 'string' ? props.children : '';
  const Tag = level === 2 ? 'h2' : 'h3';
  const size = level === 2 ? 'text-2xl' : 'text-xl';
  return (
    <Tag
      id={slugify(text)}
      className={`scroll-m-20 font-sans ${size} font-semibold tracking-tight`}
      {...props}
    />
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => <MdxHeading level={2} {...props} />,
  h3: (props) => <MdxHeading level={3} {...props} />,
  p: (props) => (
    <p className="text-sm text-muted-foreground leading-relaxed" {...props} />
  ),
  // Only style inline code — rehype-pretty-code handles code inside pre
  code: ({ children, ...props }) => {
    const isInline = !('data-language' in props);
    return isInline ? (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props}>
        {children}
      </code>
    ) : (
      <code {...props}>{children}</code>
    );
  },
  pre: MdxCodeBlock,
  ComponentPreview,
  ComponentSource,
  CodeBlock,
  CollapsibleCode,
  InstallationTabs,
  Steps,
  Step,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  BrandSwatches,
  SemanticColorsGrid,
  UITokensGrid,
  TypefacePreviews,
  LightVariables,
  DarkVariables,
  BrandPaletteVariables,
};
