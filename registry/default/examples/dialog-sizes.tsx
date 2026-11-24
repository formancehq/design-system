'use client';

import { Button } from '@/registry/default/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/default/ui/dialog';

const sizes = ['sm', 'default', 'lg', 'xl', 'full'] as const;

export default function DialogSizes() {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{size}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>Size: {size}</DialogTitle>
              <DialogDescription>
                The size prop sets the maximum width of the dialog.
              </DialogDescription>
            </DialogHeader>
            {size === 'full' && (
              <div className="min-h-0 flex-1 overflow-auto rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                This area fills the remaining height. Put a graph or long
                content here.
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
