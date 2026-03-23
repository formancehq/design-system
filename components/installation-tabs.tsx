'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

export function InstallationTabs({
  cliCommand,
  manualSteps,
}: {
  cliCommand: React.ReactNode;
  manualSteps: React.ReactNode;
}) {
  return (
    <Tabs defaultValue="cli">
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli" className="mt-4">
        {cliCommand}
      </TabsContent>
      <TabsContent value="manual" className="mt-4 space-y-4">
        {manualSteps}
      </TabsContent>
    </Tabs>
  );
}
