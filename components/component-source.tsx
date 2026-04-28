import fs from 'fs';
import path from 'path';

import { CollapsibleCode } from '@/components/collapsible-code';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

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
        <CodeSnippet code={source} language="tsx" size="sm" bordered={false} />
      </CollapsibleCode>
    </div>
  );
}
