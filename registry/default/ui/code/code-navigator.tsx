'use client';

import { List } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';

import { Badge } from '@/registry/default/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';
import { type TMonacoEditorInstance } from '@/registry/default/ui/code/code-editor';
import { type TCodeLanguage } from '@/registry/default/ui/code/code-themes';
import {
  type TNavigationNode,
  parseNavigationTree,
} from '@/registry/default/ui/code/parse-navigation-tree';

export type TCodeEditorLang = TCodeLanguage;

type TCodeNavigatorProps = {
  value: string;
  language: TCodeLanguage;
  editorRef: TMonacoEditorInstance | null;
  maxDepth?: number;
};

const DEFAULT_MAX_DEPTH = 4;

function CodeNavigator({
  value,
  language,
  editorRef,
  maxDepth = DEFAULT_MAX_DEPTH,
}: TCodeNavigatorProps) {
  const [path, setPath] = useState<string[]>([]);

  const outline = useMemo(
    () => parseNavigationTree(value, language),
    [value, language]
  );

  // Validate path against current outline (content may have changed)
  const validPath = useMemo(() => {
    const result: string[] = [];
    let nodes = outline;
    for (const key of path) {
      const found = nodes.find((n) => n.key === key);
      if (!found) break;
      result.push(key);
      nodes = found.children;
    }

    return result;
  }, [outline, path]);

  // Build breadcrumb levels: one per path segment + one for the next drilldown
  const levels: { nodes: TNavigationNode[]; selected?: string }[] = [];
  let currentNodes = outline;

  levels.push({ nodes: currentNodes, selected: validPath[0] });

  for (let i = 0; i < validPath.length && levels.length < maxDepth; i++) {
    const found = currentNodes.find((n) => n.key === validPath[i]);
    if (!found || found.children.length === 0) break;
    currentNodes = found.children;
    levels.push({ nodes: currentNodes, selected: validPath[i + 1] });
  }

  const jumpToLine = (line: number) => {
    if (!editorRef) return;
    editorRef.revealLineInCenter(line);
    editorRef.setPosition({ lineNumber: line, column: 1 });
    editorRef.focus();
  };

  const handleSelect = (level: number, key: string) => {
    const newPath = [...validPath.slice(0, level), key];
    setPath(newPath);

    // Walk tree to find the selected node and jump
    let nodes = outline;
    for (const k of newPath) {
      const found = nodes.find((n) => n.key === k);
      if (!found) return;
      if (k === key) {
        jumpToLine(found.line);

        return;
      }
      nodes = found.children;
    }
  };

  if (outline.length === 0) return null;

  return (
    <div className="flex items-center gap-2 py-1.5 px-3 flex-wrap border-b border-border">
      <List className="size-4 shrink-0 text-muted-foreground" />

      {levels.map((level, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-muted-foreground text-sm">/</span>}
          <Select
            value={level.selected}
            onValueChange={(key) => handleSelect(i, key)}
          >
            <SelectTrigger
              size="sm"
              className="w-auto min-w-[140px] max-w-[200px] [&>span:first-child]:truncate"
            >
              <SelectValue
                placeholder={i === 0 ? 'Section...' : 'Jump to...'}
              />
            </SelectTrigger>
            <SelectContent>
              {level.nodes.map((node) => (
                <SelectItem key={`${node.key}-${node.line}`} value={node.key}>
                  <span className="flex items-center gap-2">
                    {node.key}
                    {node.children.length > 0 && (
                      <Badge size="sm" variant="secondary">
                        {node.children.length}
                      </Badge>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Fragment>
      ))}
    </div>
  );
}

export { CodeNavigator };
export type { TCodeNavigatorProps };
