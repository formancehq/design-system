'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

const files = [
  { name: 'README.md', content: 'An overview of the ledger schema.' },
  { name: 'chart.yaml', content: 'The chart of accounts.' },
  { name: 'payIn.num', content: 'The Numscript for a pay-in.' },
];

export default function TabsCaseSensitive() {
  return (
    <Tabs defaultValue="README.md" className="w-full max-w-md">
      <TabsList variant="line" aria-label="Generated documents">
        {files.map((file) => (
          <TabsTrigger key={file.name} value={file.name} caseSensitive>
            {file.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {files.map((file) => (
        <TabsContent
          key={file.name}
          value={file.name}
          className="p-4 text-sm text-muted-foreground"
        >
          {file.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
