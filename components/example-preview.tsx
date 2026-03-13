import fs from 'fs';
import path from 'path';

import type { TRegistryExample } from '@/config/registry-demos';
import { CodeBlock } from '@/components/code-block';
import { CollapsibleCode } from '@/components/collapsible-code';
import { ExamplePreviewClient } from '@/components/example-preview-client';
import { TypographyH3 } from '@/registry/default/ui/typography';

export async function ExamplePreview({
  example,
}: {
  example: TRegistryExample;
}) {
  let source = '';
  const filePath = path.join(process.cwd(), example.sourceFile);
  try {
    source = fs.readFileSync(filePath, 'utf-8');
  } catch {
    source = '';
  }

  return (
    <div className="space-y-4">
      <TypographyH3>{example.title}</TypographyH3>
      <ExamplePreviewClient component={example.component} />
      {source && (
        <CollapsibleCode>
          <CodeBlock code={source} lang="tsx" />
        </CollapsibleCode>
      )}
    </div>
  );
}
