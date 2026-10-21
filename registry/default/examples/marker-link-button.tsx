'use client';

import { FileTextIcon, RotateCcwIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from '@/registry/default/ui/marker';

export default function MarkerLinkButton() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker asChild>
        <a href="#links-and-buttons">
          <MarkerIcon>
            <FileTextIcon />
          </MarkerIcon>
          <MarkerContent>View the schema diff</MarkerContent>
        </a>
      </Marker>
      <Marker asChild>
        <button
          type="button"
          className="transition-colors hover:text-foreground"
          onClick={() => toast('Reverting the last edit…')}
        >
          <MarkerIcon>
            <RotateCcwIcon />
          </MarkerIcon>
          <MarkerContent>Revert this edit</MarkerContent>
        </button>
      </Marker>
    </div>
  );
}
