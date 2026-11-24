'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

const sections = [
  { value: 'accounts', label: 'Chart of accounts' },
  { value: 'transactions', label: 'Transaction templates' },
  { value: 'queries', label: 'Saved queries' },
  { value: 'metadata', label: 'Metadata schema' },
];

export default function TabsScroll() {
  return (
    <div className="w-full max-w-[390px] rounded-md border border-dashed p-4">
      <Tabs defaultValue="accounts">
        <TabsList scroll aria-label="Schema sections">
          {sections.map((section) => (
            <TabsTrigger key={section.value} value={section.value}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((section) => (
          <TabsContent
            key={section.value}
            value={section.value}
            className="p-4 text-sm text-muted-foreground"
          >
            {section.label}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
