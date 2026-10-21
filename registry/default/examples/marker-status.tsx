import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from '@/registry/default/ui/marker';
import { Spinner } from '@/registry/default/ui/spinner';

export default function MarkerStatus() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Validating the schema</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Running the Numscript dry run</MarkerContent>
      </Marker>
    </div>
  );
}
