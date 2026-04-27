import fs from 'fs';
import path from 'path';

import { CollapsibleCode } from '@/components/collapsible-code';
import { ComponentPreviewClient } from '@/components/component-preview-client';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

/** Try reading source for a demo or example by convention. */
function readSource(name: string): string {
  const cwd = process.cwd();
  for (const candidate of [
    path.join(cwd, `registry/default/demos/${name}-demo.tsx`),
    path.join(cwd, `registry/default/examples/${name}.tsx`),
  ]) {
    try {
      return fs.readFileSync(candidate, 'utf-8');
    } catch {
      // try next
    }
  }

  return '';
}

export async function ComponentPreview({
  name,
  hideCode = false,
  peekCode = true,
  showGrid = true,
  align = 'center',
}: {
  name: string;
  hideCode?: boolean;
  peekCode?: boolean;
  showGrid?: boolean;
  align?: 'start' | 'center' | 'end';
}) {
  const source = readSource(name);
  const hasCode = !hideCode && !!source;

  return (
    <div className="overflow-hidden rounded-lg border">
      <ComponentPreviewClient name={name} showGrid={showGrid} align={align} />
      {hasCode &&
        (peekCode ? (
          <CollapsibleCode>
            <CodeSnippet code={source} language="tsx" size="sm" />
          </CollapsibleCode>
        ) : (
          <div className="border-t">
            <CodeSnippet code={source} language="tsx" size="sm" />
          </div>
        ))}
    </div>
  );
}
