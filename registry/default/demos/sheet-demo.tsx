'use client';

import { Button } from '@/registry/default/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/registry/default/ui/sheet';

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configuration</SheetTitle>
          <SheetDescription>Update your stack settings here.</SheetDescription>
        </SheetHeader>
        <div className="p-4 text-sm text-muted-foreground">
          Sheet content goes here.
        </div>
      </SheetContent>
    </Sheet>
  );
}
