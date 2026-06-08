import { Endpoint } from '@/registry/default/ui/endpoint';

export default function EndpointDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Endpoint method="GET" statusCode={200} />
      <Endpoint method="POST" statusCode={201} />
      <Endpoint method="PUT" statusCode={204} />
      <Endpoint method="PATCH" statusCode={400} />
      <Endpoint method="DELETE" statusCode={404} />
      <Endpoint method="GET" statusCode={500} />
    </div>
  );
}
