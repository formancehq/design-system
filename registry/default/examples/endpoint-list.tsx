'use client';

import { Endpoint } from '@/registry/default/ui/endpoint';

const ROUTES = [
  {
    method: 'POST',
    statusCode: 201,
    path: '/api/membership/applications/{applicationId}/clients',
  },
  {
    method: 'GET',
    statusCode: 404,
    path: '/api/membership/applications/{applicationId}/clients/{clientId}',
  },
  {
    method: 'PUT',
    statusCode: 422,
    path: '/api/membership/applications/{applicationId}/clients/{clientId}',
  },
  {
    method: 'DELETE',
    statusCode: 500,
    path: '/api/membership/applications/{applicationId}/clients/{clientId}',
  },
] as const;

export default function EndpointList() {
  return (
    <div className="flex flex-col gap-2">
      {ROUTES.map((route) => (
        <Endpoint
          key={`${route.method}-${route.statusCode}-${route.path}`}
          method={route.method}
          statusCode={route.statusCode}
          path={route.path}
        />
      ))}
    </div>
  );
}
