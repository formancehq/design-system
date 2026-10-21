import {
  ChevronRightIcon,
  FilePenIcon,
  FilePlusIcon,
  GitCommitHorizontalIcon,
} from 'lucide-react';

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from '@/registry/default/ui/code-block';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/default/ui/sheet';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '@/registry/default/ui/trace';

const files = [
  {
    path: 'schema/transactions/deposit.num',
    added: false,
    additions: 1,
    deletions: 1,
    diff: `@@ -1,6 +1,6 @@
 vars { monetary $amount account $client }
 send $amount (
-  source = @bank:omnibus
+  source = @world
   destination = @clients:$client:available
 )`,
  },
  {
    path: 'schema/tests/deposit.yaml',
    added: true,
    additions: 7,
    deletions: 0,
    diff: `@@ -0,0 +1,7 @@
+name: deposit funds a client
+script: transactions/deposit.num
+vars:
+  amount: EUR/2 10000
+  client: acme
+expect:
+  clients:acme:available: EUR/2 10000`,
  },
];

function DiffLines({ diff }: { diff: string }) {
  return diff.split('\n').map((line, index) => {
    if (line.startsWith('@@')) {
      return (
        <CodeBlockLine key={index} className="text-muted-foreground">
          {line}
        </CodeBlockLine>
      );
    }

    return (
      <CodeBlockLine
        key={index}
        variant={
          line.startsWith('+')
            ? 'added'
            : line.startsWith('-')
              ? 'removed'
              : 'default'
        }
      >
        {line.slice(1)}
      </CodeBlockLine>
    );
  });
}

export default function TraceCommit() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GitCommitHorizontalIcon />
            </TraceIcon>
            <TraceTitle>Committed a1b2c3: Fund deposits from world</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {files.map((file) => (
              <Sheet key={file.path}>
                <SheetTrigger>
                  <TraceLine>
                    <TraceIcon>
                      {file.added ? <FilePlusIcon /> : <FilePenIcon />}
                    </TraceIcon>
                    <TraceTitle>
                      {file.added ? 'Added' : 'Edited'} {file.path}
                    </TraceTitle>
                    <TraceDescription className="font-mono">
                      +{file.additions} −{file.deletions}
                    </TraceDescription>
                    <TraceIcon>
                      <ChevronRightIcon />
                    </TraceIcon>
                  </TraceLine>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="font-mono">{file.path}</SheetTitle>
                    <SheetDescription>
                      {file.additions} additions, {file.deletions} deletions
                    </SheetDescription>
                  </SheetHeader>
                  <CodeBlock className="mx-6 mb-6 w-auto">
                    <CodeBlockContent>
                      <DiffLines diff={file.diff} />
                    </CodeBlockContent>
                  </CodeBlock>
                </SheetContent>
              </Sheet>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
