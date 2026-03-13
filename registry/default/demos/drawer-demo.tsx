'use client';

import { Button } from '@/registry/default/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/registry/default/ui/drawer';

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Settings</DrawerTitle>
          <DrawerDescription>Make changes to your stack configuration.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 text-sm text-muted-foreground">
          Drawer content goes here.
        </div>
        <DrawerFooter>
          <Button variant="primary" size="sm">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
