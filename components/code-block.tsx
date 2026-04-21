import { highlightCode } from '@/lib/highlight';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/copy-button';

export async function CodeBlock({
  code,
  lang = 'tsx',
  noBorder = false,
}: {
  code: string;
  lang?: string;
  noBorder?: boolean;
}) {
  const html = await highlightCode(code, lang);

  return (
    <div className="group relative">
      <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton text={code} />
      </div>
      <div
        className={cn(
          'overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_code]:font-mono',
          noBorder ? 'bg-muted/30' : 'rounded-lg border bg-muted/30'
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
