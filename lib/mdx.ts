import fs from 'fs';
import path from 'path';

export function readMdxFile(slug: string): string | null {
  const filePath = path.join(process.cwd(), `content/docs/${slug}.mdx`);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function readFirstExisting(...candidates: string[]): string | null {
  for (const file of candidates) {
    try {
      return fs.readFileSync(file, 'utf-8');
    } catch {
      // try next
    }
  }

  return null;
}

function readDemoSource(name: string): string | null {
  const cwd = process.cwd();

  return readFirstExisting(
    path.join(cwd, `registry/default/demos/${name}-demo.tsx`),
    path.join(cwd, `registry/default/examples/${name}.tsx`)
  );
}

function readUiSource(name: string): string | null {
  return readFirstExisting(
    path.join(process.cwd(), `registry/default/ui/${name}.tsx`)
  );
}

function fence(code: string, lang = 'tsx') {
  return `\`\`\`${lang}\n${code.trimEnd()}\n\`\`\``;
}

/**
 * Convert MDX into LLM-friendly markdown by inlining registry source files
 * referenced via `<ComponentPreview />` and `<ComponentSource />`.
 */
export function processMdxForLLM(source: string): string {
  let out = source;

  out = out.replace(
    /<ComponentPreview\s+([^/>]*)\/>/g,
    (_match, attrs: string) => {
      const name = /name=["']([^"']+)["']/.exec(attrs)?.[1];
      if (!name) return '';
      const code = readDemoSource(name);
      if (!code) return '';

      return `**Example — \`${name}\`:**\n\n${fence(code)}`;
    }
  );

  out = out.replace(
    /<ComponentSource\s+([^/>]*)\/>/g,
    (_match, attrs: string) => {
      const name = /name=["']([^"']+)["']/.exec(attrs)?.[1];
      if (!name) return '';
      const code = readUiSource(name);
      if (!code) return '';

      return `**Source — \`${name}.tsx\`:**\n\n${fence(code)}`;
    }
  );

  return out;
}

export function buildLLMMarkdown({
  title,
  section,
  description,
  source,
  url,
}: {
  title: string;
  section: string;
  description?: string;
  source: string;
  url: string;
}): string {
  const header = [
    `# ${title}`,
    `> Section: ${section}`,
    description ? `\n${description}` : '',
    `\nSource: ${url}`,
  ]
    .filter(Boolean)
    .join('\n');

  return `${header}\n\n${processMdxForLLM(source)}\n`;
}
