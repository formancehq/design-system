'use client';

import { Endpoint } from '@/registry/default/ui/endpoint';

export default function EndpointStates() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Endpoint method="GET" statusCode={200} />
      <Endpoint method="POST" statusCode={400} />
      <Endpoint method="DELETE" statusCode={500} />
      <Endpoint method="GET" path="/api/ledger/v2/{ledger}/transactions" />
      <Endpoint statusCode={204} />
      <Endpoint method="HEAD" />
    </div>
  );
}
