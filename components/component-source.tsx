import fs from 'fs';
import path from 'path';

import { CodeBlock } from '@/components/code-block';
import { CollapsibleCode } from '@/components/collapsible-code';

export async function ComponentSource({ name }: { name: string }) {
  const filePath = path.join(process.cwd(), `registry/default/ui/${name}.tsx`);
  let source = '';
  try {
    source = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <CollapsibleCode>
        <CodeBlock code={source} lang="tsx" noBorder />
      </CollapsibleCode>
    </div>
  );
}
