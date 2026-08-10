import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  DescriptionTermDescription,
} from '@/registry/default/ui/description-list';

export default function DescriptionListDemo() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-lg">
      <DescriptionList>
        {/* The term is a label and the status is a word, so both stay sans.
            The ledger name is an identifier and the date is data, so both take
            font-mono — the list itself is font-agnostic on purpose. */}
        <DescriptionTerm>Ledger</DescriptionTerm>
        <DescriptionDetails className="font-mono">
          main-ledger
        </DescriptionDetails>
        <DescriptionTerm>
          Status
          <DescriptionTermDescription>
            Current state of the ledger.
          </DescriptionTermDescription>
        </DescriptionTerm>
        <DescriptionDetails>Active</DescriptionDetails>
        <DescriptionTerm>Created</DescriptionTerm>
        <DescriptionDetails className="font-mono">
          Mar 12, 2026 - 09:41 AM
        </DescriptionDetails>
      </DescriptionList>
    </div>
  );
}
