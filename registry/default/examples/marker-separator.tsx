import { Marker, MarkerContent } from '@/registry/default/ui/marker';

export default function MarkerSeparator() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Switched to edit mode</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent className="shimmer">
          Validating 12 accounts
        </MarkerContent>
      </Marker>
    </div>
  );
}
