import { Marker, MarkerContent } from '@/registry/default/ui/marker';

export default function MarkerShimmer() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker role="status">
        <MarkerContent className="shimmer">Thinking…</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent className="shimmer">Reading 4 accounts</MarkerContent>
      </Marker>
    </div>
  );
}
