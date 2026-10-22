import { TriangleAlertIcon } from 'lucide-react';

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from '@/registry/default/ui/marker';

const warnings = [
  { path: 'accounts.fees', message: 'Account has no outgoing transaction' },
  { path: 'transactions.accrue', message: 'Posts from world without a cap' },
];

export default function MarkerBorder() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 py-12">
      {warnings.map((warning) => (
        <Marker key={warning.path} variant="border">
          <MarkerIcon>
            <TriangleAlertIcon />
          </MarkerIcon>
          <MarkerContent>
            <code>{warning.path}</code>: {warning.message}
          </MarkerContent>
        </Marker>
      ))}
    </div>
  );
}
