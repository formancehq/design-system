import fs from 'fs';
import type { Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import path from 'path';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { CompoundComponents } from '@/components/compound-components';
import { DocsPager } from '@/components/docs-pager';
import { mdxComponents } from '@/components/mdx-components';
import { SourceBanner } from '@/components/source-banner';
import { componentMeta, docsConfig } from '@/config/docs';
import { slugify } from '@/lib/slugify';
import { PageContainer } from '@/registry/default/ui/page-container';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderMeta,
  PageHeaderSummary,
  PageHeaderTitle,
} from '@/registry/default/ui/page-header';
import { Separator } from '@/registry/default/ui/separator';
import { TableOfContents } from '@/registry/default/ui/table-of-contents';

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

function readMdxFile(slug: string): string | null {
  const filePath = path.join(process.cwd(), `content/docs/${slug}.mdx`);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/** Extract h2/h3 headings (markdown + <Section title="..."/>) from MDX source for the TOC. */
function extractHeadings(source: string) {
  const items: { index: number; id: string; title: string; level: number }[] = [];

  for (const m of source.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
    const title = m[2].trim();
    items.push({
      index: m.index ?? 0,
      id: slugify(title),
      title,
      level: m[1].length,
    });
  }

  for (const m of source.matchAll(/<Section\b([^>]*)>/g)) {
    const attrs = m[1];
    const title = /title="([^"]+)"/.exec(attrs)?.[1];
    if (!title) continue;
    const lvl = /level=\{?(\d)\}?/.exec(attrs)?.[1];
    items.push({
      index: m.index ?? 0,
      id: slugify(title),
      title,
      level: lvl ? Number(lvl) : 2,
    });
  }

  return items
    .sort((a, b) => a.index - b.index)
    .map(({ id, title, level }) => ({ id, title, level }));
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
  const mdxSource = readMdxFile(slugStr);

  if (!mdxSource) notFound();

  const headings = extractHeadings(mdxSource);

  if (meta?.subComponents && meta.subComponents.length > 0) {
    headings.push({
      id: 'compound-components',
      title: 'Compound Components',
      level: 2,
    });
  }
  const { content: mdxContent } = await compileMDX({
    source: mdxSource,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  return (
    <div className="xl:grid xl:grid-cols-[1fr_220px]">
      <div data-slot="docs-page">
        <Breadcrumbs />
        <PageHeader size="large" background border>
          <PageHeaderMeta>
            <PageHeaderSummary>
              <PageHeaderEyebrow>{found.section}</PageHeaderEyebrow>
              <PageHeaderTitle>{found.item.title}</PageHeaderTitle>
              {meta && (
                <PageHeaderDescription>
                  {meta.description}
                </PageHeaderDescription>
              )}
            </PageHeaderSummary>
          </PageHeaderMeta>
        </PageHeader>

        <PageContainer size="large" className="py-8">
          <div className="grid gap-8">
            {meta && (
              <>
                <SourceBanner source={meta.source} />
                <Separator />
              </>
            )}

            <div className="space-y-8">{mdxContent}</div>

            {meta?.subComponents && meta.subComponents.length > 0 && (
              <div className="space-y-4">
                <h2
                  id="compound-components"
                  className="scroll-m-20 font-sans text-2xl font-semibold tracking-tight"
                >
                  Compound Components
                </h2>
                <CompoundComponents subComponents={meta.subComponents} />
              </div>
            )}

            <DocsPager />
          </div>
        </PageContainer>
      </div>

      <aside
        data-slot="docs-sidebar"
        className="hidden xl:block border-l bg-background"
      >
        <div className="sticky top-12 h-[calc(100vh-3rem)] overflow-auto p-6">
          {headings.length > 0 && <TableOfContents headings={headings} />}
        </div>
      </aside>
    </div>
  );
}
