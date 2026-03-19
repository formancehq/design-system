'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/registry/default/ui/resizable';

export default function ResizableWithHandleExample() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-[200px] max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Ledger</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Transactions</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
