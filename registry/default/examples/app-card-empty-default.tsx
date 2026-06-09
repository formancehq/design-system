import { AppCardEmpty } from '@/components/ui-fragments/app-card-empty';

export default function AppCardEmptyExample() {
  return (
    <div className="w-full max-w-2xl">
      <AppCardEmpty
        title="Nothing here yet"
        description="Default empty state with no actions and the fallback icon."
      />
    </div>
  );
}
