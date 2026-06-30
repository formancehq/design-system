import ledgerSchemaBase from '../ledger-schema.json';
import ledgerSchemaExtended from '../ledger-schema.extended.json';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ variant: [] }, { variant: ['extended'] }];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ variant?: string[] }> }
) {
  const { variant } = await params;
  const isExtended = variant?.[0] === 'extended';
  const schema = isExtended ? ledgerSchemaExtended : ledgerSchemaBase;

  return new Response(JSON.stringify(schema, null, 2), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/schema+json',
      'Cache-Control': 'public, max-age=3600, s-maxage=31536000',
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}
