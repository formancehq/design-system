import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { docsConfig, componentMeta } from '@/config/docs';
import { registryExamples } from '@/config/registry-examples';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { DocsPager } from '@/components/docs-pager';
import { ComponentPreview } from '@/components/component-preview';
import { ExamplesSection } from '@/components/examples-section';
import { CodeBlock } from '@/components/code-block';
import { CollapsibleCode } from '@/components/collapsible-code';
import { TableOfContents } from '@/registry/default/ui/table-of-contents';
import { InstallationContent } from '@/components/docs/installation-content';
import { ColorsContent } from '@/components/docs/colors-content';
import { TypographyContent } from '@/components/docs/typography-content';
import { ThemingContent } from '@/components/docs/theming-content';
import { TypographyH1, TypographyH2, TypographyLead } from '@/registry/default/ui/typography';

import { REGISTRY_URL } from '@/lib/registry';

function findSidebarItem(slug: string) {
  for (const section of docsConfig.sidebarNav) {
    for (const item of section.items) {
      if (item.href === `/docs/${slug}`) {
        return { item, section: section.title };
      }
    }
  }
  return null;
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  for (const section of docsConfig.sidebarNav) {
    for (const item of section.items) {
      if (item.href.startsWith('/docs/')) {
        const slug = item.href.replace('/docs/', '').split('/');
        params.push({ slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const found = findSidebarItem(slugStr);
  const meta = componentMeta[slugStr];

  return {
    title: found
      ? `${found.item.title} - Formance Design System`
      : 'Formance Design System',
    description: meta?.description ?? 'Formance Design System documentation.',
  };
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const found = findSidebarItem(slugStr);

  if (!found) notFound();

  const meta = componentMeta[slugStr];
  const isComponent = !!meta;

  const gettingStartedPages: Record<string, React.ReactNode> = {
    installation: <InstallationContent />,
    colors: <ColorsContent />,
    typography: <TypographyContent />,
    theming: <ThemingContent />,
  };

  const gettingStartedContent = gettingStartedPages[slugStr];

  let sourceCode = '';
  if (isComponent) {
    const filePath = path.join(process.cwd(), meta.sourceFile);
    try {
      sourceCode = fs.readFileSync(filePath, 'utf-8');
    } catch {
      sourceCode = '';
    }
  }

  const examples = isComponent
    ? registryExamples[meta.registryName] ?? []
    : [];

  const exampleCodeBlocks: Record<string, React.ReactNode> = {};
  for (const example of examples) {
    const filePath = path.join(process.cwd(), example.sourceFile);
    try {
      const code = fs.readFileSync(filePath, 'utf-8');
      exampleCodeBlocks[example.sourceFile] = (
        <CollapsibleCode>
          <CodeBlock code={code} lang="tsx" />
        </CollapsibleCode>
      );
    } catch {
      // skip
    }
  }

  const gettingStartedHeadings: Record<string, { id: string; title: string; level: number }[]> = {
    installation: [
      { id: 'quick-start', title: 'Quick Start', level: 2 },
      { id: 'namespace', title: '@formance Namespace', level: 2 },
      { id: 'direct-url', title: 'Direct URL', level: 2 },
      { id: 'prerequisites', title: 'Prerequisites', level: 2 },
    ],
    colors: [
      { id: 'brand-palettes', title: 'Brand Palettes', level: 2 },
      { id: 'semantic-colors', title: 'Semantic Colors', level: 2 },
      { id: 'ui-tokens', title: 'UI Tokens', level: 2 },
    ],
    typography: [
      { id: 'typefaces', title: 'Typefaces', level: 2 },
      { id: 'scale', title: 'Type Scale', level: 2 },
      { id: 'usage', title: 'Usage', level: 2 },
    ],
    theming: [
      { id: 'light-dark', title: 'Light & Dark Mode', level: 2 },
      { id: 'css-variables', title: 'CSS Variables', level: 2 },
      { id: 'customization', title: 'Customization', level: 2 },
    ],
  };

  const headings = isComponent
    ? [
        { id: 'preview', title: 'Preview', level: 2 },
        ...(examples.length > 0
          ? [{ id: 'examples', title: 'Examples', level: 2 }]
          : []),
        { id: 'installation', title: 'Installation', level: 2 },
        { id: 'source', title: 'Source', level: 2 },
      ]
    : gettingStartedHeadings[slugStr] ?? [];

  return (
    <div className="xl:grid xl:grid-cols-[1fr_220px] xl:gap-6">
      <div className="min-w-0 space-y-8">
        <div className="space-y-4">
          <Breadcrumbs />
          <TypographyH1>{found.item.title}</TypographyH1>
          {meta && (
            <TypographyLead>{meta.description}</TypographyLead>
          )}
        </div>

        {isComponent && (
          <>
            <section id="preview" className="space-y-4">
              <TypographyH2>Preview</TypographyH2>
              <ComponentPreview name={meta.registryName} />
            </section>

            {examples.length > 0 && (
              <section id="examples" className="space-y-8">
                <TypographyH2>Examples</TypographyH2>
                <ExamplesSection
                  registryName={meta.registryName}
                  codeBlocks={exampleCodeBlocks}
                />
              </section>
            )}

            <section id="installation" className="space-y-4">
              <TypographyH2>Installation</TypographyH2>
              <CodeBlock
                code={`npx shadcn@latest add @formance/${meta.registryName}`}
                lang="bash"
              />
            </section>

            {sourceCode && (
              <section id="source" className="space-y-4">
                <TypographyH2>Source</TypographyH2>
                <CollapsibleCode>
                  <CodeBlock code={sourceCode} lang="tsx" />
                </CollapsibleCode>
              </section>
            )}
          </>
        )}

        {gettingStartedContent}

        <DocsPager />
      </div>

      {headings.length > 0 && (
        <div className="hidden xl:block">
          <div className="sticky top-16 py-10">
            <TableOfContents headings={headings} />
          </div>
        </div>
      )}
    </div>
  );
}
