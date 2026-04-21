'use client';

import { Button } from '@/registry/default/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/default/ui/sheet';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

export default function SheetSideExample() {
  return (
    <div className="flex flex-wrap gap-2">
      {SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit Ledger</SheetTitle>
              <SheetDescription>
                Update your ledger configuration. Click save when done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor={`name-${side}`}>Ledger Name</Label>
                <Input id={`name-${side}`} defaultValue="main-ledger" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`bucket-${side}`}>Bucket</Label>
                <Input id={`bucket-${side}`} defaultValue="default" />
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
