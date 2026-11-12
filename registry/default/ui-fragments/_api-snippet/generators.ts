export type TStackOperation = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  path: string;
  pathParams: string[];
  sdk?: { module: string; method: string };
  summary?: string;
  tags?: string[];
};

export type TStackOperationsIndex = {
  _meta?: { specVersion?: string; specFile?: string };
  operations: Record<string, TStackOperation>;
};

export type TResolvedOperation = {
  method: string;
  baseUrl: string;
  path: string;
  query: [string, unknown][];
  headers: Record<string, string>;
  body?: unknown;
  bodyFile?: string;
  rawArgs?: string;
  pathParams?: Record<string, string>;
  sdk?: { module: string; method: string };
};

export type TResolveOperationInput = {
  params?: Record<string, string>;
  query?: [string, unknown][];
  body?: unknown;
  bodyFile?: string;
  rawArgs?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
};

const MAX_COMPACT_LENGTH = 80;

export function resolvePathParams(
  path: string,
  params?: Record<string, string>
): string {
  if (!params) return path;
  let resolved = path;
  for (const [k, v] of Object.entries(params))
    resolved = resolved.replace(`{${k}}`, v);

  return resolved;
}

export function resolveOperation(
  operation: TStackOperation,
  {
    params,
    query = [],
    body,
    bodyFile,
    rawArgs,
    baseUrl = '$FORMANCE_API_URL',
    headers = {},
  }: TResolveOperationInput = {}
): TResolvedOperation {
  return {
    method: operation.method,
    baseUrl,
    path: resolvePathParams(operation.path, params),
    query,
    headers,
    body,
    bodyFile,
    rawArgs,
    pathParams: params,
    sdk: operation.sdk,
  };
}

function shellSingleQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function formatValue(label: string, value: unknown): string {
  if (typeof value !== 'object' || value === null) return `${label}${value}`;
  const compact = `${label}${JSON.stringify(value)}`;
  if (compact.length <= MAX_COMPACT_LENGTH) return compact;

  return `${label}${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')}`;
}

export function generateCurl(op: TResolvedOperation): string {
  const isGet = op.method === 'GET';
  const queryString = op.query
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v))}`
    )
    .join('&');
  const url =
    isGet || !queryString
      ? `${op.baseUrl}${op.path}`
      : `${op.baseUrl}${op.path}?${queryString}`;
  const parts = [isGet ? `curl -G "${url}"` : `curl -X ${op.method} "${url}"`];
  if (isGet)
    for (const [k, v] of op.query)
      parts.push(
        `  --data-urlencode ${shellSingleQuote(formatValue(`${k}=`, v))}`
      );
  for (const [k, v] of Object.entries(op.headers))
    parts.push(`  -H "${k}: ${v}"`);
  if (op.bodyFile) {
    parts.push(`  -H "Content-Type: application/json"`);
    parts.push(`  -d @${shellSingleQuote(op.bodyFile)}`);
  } else if (op.body !== undefined) {
    parts.push(`  -H "Content-Type: application/json"`);
    parts.push(`  -d ${shellSingleQuote(formatValue('', op.body))}`);
  }
  if (op.rawArgs) parts.push(`  ${op.rawArgs}`);

  return parts.join(' \\\n');
}

export function generateHttpie(op: TResolvedOperation): string {
  const verb = op.method === 'GET' ? '' : `${op.method} `;
  const parts = [`http ${verb}"${op.baseUrl}${op.path}"`];
  for (const [k, v] of op.query)
    parts.push(`  ${shellSingleQuote(formatValue(`${k}==`, v))}`);
  for (const [k, v] of Object.entries(op.headers)) parts.push(`  "${k}:${v}"`);
  if (op.bodyFile) parts.push(`  < ${shellSingleQuote(op.bodyFile)}`);
  else if (
    typeof op.body === 'object' &&
    op.body !== null &&
    !Array.isArray(op.body)
  )
    for (const [k, v] of Object.entries(op.body))
      parts.push(
        `  ${shellSingleQuote(typeof v === 'string' ? `${k}=${v}` : formatValue(`${k}:=`, v))}`
      );
  else if (op.body !== undefined)
    parts.push(`  --raw ${shellSingleQuote(formatValue('', op.body))}`);
  if (op.rawArgs) parts.push(`  ${op.rawArgs}`);

  return parts.join(' \\\n');
}

export function generateSdk(op: TResolvedOperation): string {
  if (!op.sdk) return '';

  const args: Record<string, unknown> = {
    ...op.pathParams,
    ...Object.fromEntries(op.query),
    ...(op.body && typeof op.body === 'object' && !Array.isArray(op.body)
      ? op.body
      : {}),
  };
  const argsBlock = Object.keys(args).length
    ? JSON.stringify(args, null, 2)
    : '{}';
  const namespace = op.sdk.module.replace(/V(\d+)$/, '.v$1');
  const call = [namespace, op.sdk.method].filter(Boolean).join('.');

  return [
    `import { SDK } from '@formance/formance-sdk';`,
    ``,
    `const sdk = new SDK({ serverURL: ${op.baseUrl.startsWith('$') ? `process.env.${op.baseUrl.slice(1)}` : JSON.stringify(op.baseUrl)} });`,
    ``,
    `const result = await sdk.${call}(${argsBlock});`,
  ].join('\n');
}
