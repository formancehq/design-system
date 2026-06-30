import schema from '../ledger-schema.extended.json';

// Prerendered to a static file at build; CORS headers are applied via
// next.config `headers()` so they're served at the edge regardless.
export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(schema, null, 2), {
    headers: {
      'Content-Type': 'application/schema+json',
      'Cache-Control': 'public, max-age=3600, s-maxage=31536000',
    },
  });
}
