'use client';

import { Button } from '@/registry/default/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { Label } from '@/registry/default/ui/label';
import { Input } from '@/registry/default/ui/input';

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-3">
          <p className="text-sm font-medium">Quick Settings</p>
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
