'use client';

import { SearchIcon } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/default/ui/drawer';
import { Marker } from '@/registry/default/ui/marker';

const accounts = [
  'bank:omnibus',
  'clients:001:available',
  'clients:002:available',
  'treasury:interest',
];

export default function MarkerDrawer() {
  return (
    <div className="w-full max-w-sm">
      <Drawer direction="right">
        <Marker variant="separator">
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">
              <SearchIcon className="size-4" />
              Explored 4 accounts
            </Button>
          </DrawerTrigger>
        </Marker>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Account activity</DrawerTitle>
            <DrawerDescription>
              Accounts the agent read while preparing the answer.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-3 px-4 text-sm">
            {accounts.map((account) => (
              <div
                key={account}
                className="flex items-center justify-between gap-4 border px-3 py-2"
              >
                <span className="truncate font-mono text-xs">{account}</span>
                <span className="text-muted-foreground">read</span>
              </div>
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
