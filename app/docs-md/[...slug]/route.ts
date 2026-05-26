import { componentMeta, docsConfig } from '@/config/docs';
import { buildLLMMarkdown, readMdxFile } from '@/lib/mdx';

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const slugStr = slug.join('/');
  const found = findSidebarItem(slugStr);
  const source = readMdxFile(slugStr);

  if (!found || !source) {
    return new Response('Not found', { status: 404 });
  }

  const meta = componentMeta[slugStr];
  const markdown = buildLLMMarkdown({
    title: found.item.title,
    section: found.section,
    description: meta?.description,
    source,
    url: `https://design.formance.com/docs/${slugStr}`,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
