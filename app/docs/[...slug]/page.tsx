import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';

import { docsConfig, componentMeta } from '@/config/docs';
import { cssVarsTheme } from '@/lib/shiki-theme';
import { slugify } from '@/lib/slugify';
import { mdxComponents } from '@/components/mdx-components';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { DocsPager } from '@/components/docs-pager';
import { TableOfContents } from '@/registry/default/ui/table-of-contents';
import { InstallationContent } from '@/components/docs/installation-content';
import { ColorsContent } from '@/components/docs/colors-content';
import { TypographyContent } from '@/components/docs/typography-content';
import { ThemingContent } from '@/components/docs/theming-content';
import { AtomsIntroduction } from '@/components/docs/atoms-introduction';
import { FragmentsIntroduction } from '@/components/docs/fragments-introduction';
import { SourceBanner } from '@/components/source-banner';
import { Separator } from '@/registry/default/ui/separator';
import { TypographyH1, TypographyLead } from '@/registry/default/ui/typography';

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

/** Extract h2/h3 headings from MDX source for the table of contents. */
function extractHeadings(source: string) {
  return [...source.matchAll(/^(#{2,3})\s+(.+)/gm)].map((m) => ({
    id: slugify(m[2].trim()),
    title: m[2].trim(),
    level: m[1].length,
  }));
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

  // Static getting-started pages
  const gettingStartedPages: Record<string, React.ReactNode> = {
    installation: <InstallationContent />,
    colors: <ColorsContent />,
    typography: <TypographyContent />,
    theming: <ThemingContent />,
    'components/introduction': <AtomsIntroduction />,
    'fragments/introduction': <FragmentsIntroduction />,
  };

  const gettingStartedContent = gettingStartedPages[slugStr];

  // Try loading MDX content for this slug
  const mdxSource = readMdxFile(slugStr);

  let mdxContent: React.ReactNode = null;
  let headings: { id: string; title: string; level: number }[] = [];

  if (mdxSource) {
    headings = extractHeadings(mdxSource);
    const { content } = await compileMDX({
      source: mdxSource,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          rehypePlugins: [
            [rehypePrettyCode, { theme: cssVarsTheme, keepBackground: false }],
          ],
        },
      },
    });
    mdxContent = content;
  } else if (gettingStartedContent) {
    // Getting started pages have hardcoded headings
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
        { id: 'convention', title: 'Convention', level: 2 },
        { id: 'css-variables', title: 'CSS Variables', level: 2 },
        { id: 'light-mode', title: 'Light Mode', level: 3 },
        { id: 'dark-mode', title: 'Dark Mode', level: 3 },
        { id: 'brand-palettes', title: 'Brand Palettes', level: 2 },
        { id: 'customization', title: 'Customization', level: 2 },
      ],
    };
    headings = gettingStartedHeadings[slugStr] ?? [];
  }

  return (
    <div className="xl:grid xl:grid-cols-[1fr_220px] xl:gap-6">
      <div className="min-w-0 space-y-8">
        <div className="space-y-4">
          <Breadcrumbs />
          <TypographyH1>{found.item.title}</TypographyH1>
          {meta && <TypographyLead>{meta.description}</TypographyLead>}
        </div>

        {meta && <SourceBanner source={meta.source} />}

        <Separator />

        {mdxContent && (
          <div className="space-y-8">{mdxContent}</div>
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
