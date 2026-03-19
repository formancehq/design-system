'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/registry/default/ui/resizable';

export default function ResizableVerticalExample() {
  return (
    <ResizablePanelGroup orientation="vertical" className="min-h-[300px] max-w-md rounded-lg border">
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
