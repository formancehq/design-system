import { highlightCode } from '@/lib/highlight';

import { CopyButton } from '@/components/copy-button';

export async function CodeBlock({
  code,
  lang = 'tsx',
}: {
  code: string;
  lang?: string;
}) {
  const html = await highlightCode(code, lang);

  return (
    <div className="group relative">
      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton text={code} />
      </div>
      <div
        className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-sm [&_pre]:!bg-transparent [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
