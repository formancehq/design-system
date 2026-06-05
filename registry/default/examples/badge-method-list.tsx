'use client';

import { BadgeMethod } from '@/registry/default/ui/badge-method';

const ROUTES = [
  {
    method: 'POST',
    path: '/api/membership/applications/{applicationId}/clients',
  },
  {
    method: 'GET',
    path: '/api/membership/applications/{applicationId}/clients/{clientId}',
  },
  {
    method: 'PUT',
    path: '/api/membership/applications/{applicationId}/clients/{clientId}',
  },
  {
    method: 'DELETE',
    path: '/api/membership/applications/{applicationId}/clients/{clientId}',
  },
] as const;

export default function BadgeMethodList() {
  return (
    <div className="flex flex-col gap-2">
      {ROUTES.map((route) => (
        <div
          key={`${route.method}-${route.path}`}
          className="flex items-center gap-3"
        >
          <BadgeMethod method={route.method} />
          <span className="font-mono text-sm text-foreground">
            {route.path}
          </span>
        </div>
      ))}
    </div>
  );
}
