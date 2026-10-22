'use client';

import * as React from 'react';
import { ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/registry/default/ui/collapsible';

type TFileNode =
  | { type: 'file'; name: string; path: string }
  | { type: 'folder'; name: string; path: string; children: TFileNode[] };

const files: TFileNode[] = [
  { type: 'file', name: 'schema.yaml', path: 'schema.yaml' },
  {
    type: 'folder',
    name: 'numscript',
    path: 'numscript',
    children: [
      { type: 'file', name: 'deposit.num', path: 'numscript/deposit.num' },
      {
        type: 'file',
        name: 'withdrawal.num',
        path: 'numscript/withdrawal.num',
      },
      {
        type: 'file',
        name: 'accrue-interest.num',
        path: 'numscript/accrue-interest.num',
      },
    ],
  },
  {
    type: 'folder',
    name: 'queries',
    path: 'queries',
    children: [
      {
        type: 'file',
        name: 'client-balance.yaml',
        path: 'queries/client-balance.yaml',
      },
    ],
  },
];

function FileTreeNode({
  node,
  selected,
  onSelect,
}: {
  node: TFileNode;
  selected: string;
  onSelect: (path: string) => void;
}) {
  switch (node.type) {
    case 'folder':
      return (
        <Collapsible defaultOpen className="group/folder">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              caseSensitive
              className="w-full justify-start gap-1.5 font-normal aria-expanded:bg-transparent aria-expanded:hover:bg-muted dark:aria-expanded:hover:bg-muted/50"
            >
              <ChevronRightIcon className="size-4 shrink-0 transition-transform group-data-[state=open]/folder:rotate-90" />
              <FolderIcon className="size-4 shrink-0" />
              {node.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="ml-4 flex flex-col">
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    case 'file':
      return (
        <Button
          variant="ghost"
          size="sm"
          caseSensitive
          className={`w-full justify-start gap-1.5 font-normal ${
            selected === node.path ? 'bg-accent text-accent-foreground' : ''
          }`}
          aria-current={selected === node.path ? 'true' : undefined}
          onClick={() => onSelect(node.path)}
        >
          <FileIcon className="size-4 shrink-0" />
          {node.name}
        </Button>
      );
    default: {
      const unreachable: never = node;

      return unreachable;
    }
  }
}

export default function FileTreeDemo() {
  const [selected, setSelected] = React.useState(
    'numscript/accrue-interest.num'
  );

  return (
    <div className="flex w-full max-w-xs flex-col py-6 text-sm">
      {files.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          selected={selected}
          onSelect={setSelected}
        />
      ))}
    </div>
  );
}
