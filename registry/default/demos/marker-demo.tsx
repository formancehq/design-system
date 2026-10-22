import { CheckIcon, XIcon } from 'lucide-react';

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from '@/registry/default/ui/marker';
import { Spinner } from '@/registry/default/ui/spinner';

export default function MarkerDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 py-12">
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">Thinking…</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <CheckIcon />
        </MarkerIcon>
        <MarkerContent>Edit applied, 4 lines changed</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <XIcon />
        </MarkerIcon>
        <MarkerContent>Edit discarded</MarkerContent>
      </Marker>
    </div>
  );
}
