import fs from 'fs';
import path from 'path';

import { registryDemos } from '@/config/registry-demos';
import { CodeBlock } from '@/components/code-block';
import { CollapsibleCode } from '@/components/collapsible-code';
import { ComponentPreviewClient } from '@/components/component-preview-client';

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
  const demo = registryDemos[name];
  let source = '';

  if (demo) {
    const filePath = path.join(process.cwd(), demo.sourceFile);
    try {
      source = fs.readFileSync(filePath, 'utf-8');
    } catch {
      source = '';
    }
  }

  return (
    <div className="space-y-4">
      <ComponentPreviewClient name={name} showGrid={showGrid} align={align} />
      {!hideCode && source && (
        peekCode ? (
          <CollapsibleCode>
            <CodeBlock code={source} lang="tsx" />
          </CollapsibleCode>
        ) : (
          <CodeBlock code={source} lang="tsx" />
        )
      )}
    </div>
  );
}
