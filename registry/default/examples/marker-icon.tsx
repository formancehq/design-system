import { BookOpenCheckIcon, GitBranchIcon, SearchIcon } from 'lucide-react';

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from '@/registry/default/ui/marker';

export default function MarkerIconExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-12 py-12">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to the staging ledger</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explored 4 accounts</MarkerContent>
      </Marker>
      <Marker className="flex-col">
        <MarkerIcon>
          <BookOpenCheckIcon />
        </MarkerIcon>
        <MarkerContent>Schema synced</MarkerContent>
      </Marker>
    </div>
  );
}
