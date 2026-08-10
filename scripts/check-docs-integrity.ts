/**
 * Guards the two docs-graph invariants that `pnpm build` cannot catch, because
 * both fail by rendering a page rather than by throwing.
 * Run: `pnpm check:docs`.
 *
 * 1. Every sidebar entry needs an MDX file. `generateStaticParams` prerenders
 *    each nav href under `/docs/`, and `app/docs/[...slug]/page.tsx` calls
 *    notFound() when `content/docs/<slug>.mdx` is missing — so a nav item wired
 *    up without its MDX ships a 404 while the build reports success.
 *
 * 2. Every <ComponentPreview name> must resolve. `findDemo` misses render a
 *    "No demo available for ..." placeholder in the page body instead of
 *    failing, so a typo or a renamed demo is invisible to CI.
 */

import { existsSync } from 'node:fs';
import { glob, readFile } from 'node:fs/promises';

import { docsConfig, flattenNav } from '../config/docs';
import { findDemo } from '../config/registry-demos';

const problems: string[] = [];

// 1 — sidebar entries that would 404
const navSlugs = flattenNav()
  .map((item) => item.href)
  .filter((href) => href.startsWith('/docs/'))
  .map((href) => href.replace('/docs/', ''));

for (const slug of navSlugs) {
  if (!existsSync(`content/docs/${slug}.mdx`)) {
    const section = docsConfig.sidebarNav.find((s) =>
      s.items.some((i) => i.href === `/docs/${slug}`)
    );

    problems.push(
      `missing content/docs/${slug}.mdx — nav item "${slug}" (section: ${section?.title ?? '?'}) would 404`
    );
  }
}

// 2 — ComponentPreview references that would render a placeholder
let previewCount = 0;

for await (const file of glob('content/**/*.mdx')) {
  const source = await readFile(file, 'utf8');
  for (const [, name] of source.matchAll(
    /<ComponentPreview\s+name="([^"]+)"/g
  )) {
    previewCount++;
    if (name && !findDemo(name)) {
      problems.push(
        `${file}: <ComponentPreview name="${name}"> has no demo or example in config/registry-demos.ts`
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`✖ ${problems.length} docs integrity problem(s):\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(
  `✓ docs integrity: ${navSlugs.length} sidebar pages have MDX, ${previewCount} ComponentPreview refs resolve`
);
