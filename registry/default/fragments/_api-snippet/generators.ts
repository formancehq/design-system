export type TStackOperation = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  path: string;
  pathParams: string[];
  sdk: { module: string; method: string };
  summary?: string;
  tags?: string[];
};

export type TStackOperationsIndex = {
  _meta?: { specVersion?: string; specFile?: string };
  operations: Record<string, TStackOperation>;
};

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

export function generateCurl(
  method: string,
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
  baseUrl = '$FORMANCE_API_URL'
): string {
  const parts = [`curl -X ${method} ${baseUrl}${path}`];
  if (headers) {
    for (const [k, v] of Object.entries(headers))
      parts.push(`  -H "${k}: ${v}"`);
  }
  if (body) {
    const formatted = JSON.stringify(body, null, 2);
    const indented = formatted
      .split('\n')
      .map((l, i) => (i === 0 ? l : '  ' + l))
      .join('\n');
    parts.push(`  -H "Content-Type: application/json"`);
    parts.push(`  -d '${indented}'`);
  }
  
return parts.join(' \\\n');
}

function jsonDepth(val: unknown): number {
  if (typeof val !== 'object' || val === null) return 0;
  if (Array.isArray(val)) return 1 + Math.max(0, ...val.map(jsonDepth));
  
return (
    1 +
    Math.max(0, ...Object.values(val as Record<string, unknown>).map(jsonDepth))
  );
}

function flattenHttpieArgs(
  obj: Record<string, unknown>,
  prefix: string,
  parts: string[],
  depth = 0
) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === null || v === undefined) continue;
    if (typeof v === 'string') {
      const needsQuote = /[\s\[\](){}$@|&;!<>'"\\]/.test(v);
      parts.push(needsQuote ? `  ${key}='${v}'` : `  ${key}=${v}`);
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      parts.push(`  ${key}:=${String(v)}`);
    } else if (Array.isArray(v)) {
      parts.push(`  ${key}:='${JSON.stringify(v)}'`);
    } else if (typeof v === 'object') {
      if (depth >= 1 || Object.keys(v as object).length === 0) {
        parts.push(`  ${key}:='${JSON.stringify(v)}'`);
      } else {
        flattenHttpieArgs(v as Record<string, unknown>, key, parts, depth + 1);
      }
    }
  }
}

export function generateHttpie(
  method: string,
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
  baseUrl = '$FORMANCE_API_URL'
): string {
  const verb = method === 'GET' ? '' : method + ' ';
  const [basePath, queryString] = path.split('?');
  const parts = [`http ${verb}${baseUrl}${basePath}`];
  if (queryString) {
    for (const param of queryString.split('&')) {
      const [k, v] = param.split('=');
      parts.push(`  ${k}==${v}`);
    }
  }
  if (headers) {
    for (const [k, v] of Object.entries(headers)) parts.push(`  ${k}:${v}`);
  }
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    if (jsonDepth(body) > 2) {
      const formatted = JSON.stringify(body, null, 2);
      const indented = formatted
        .split('\n')
        .map((l) => '  ' + l)
        .join('\n');
      parts.push(`  <<< '`);
      parts.push(indented);
      parts.push(`  '`);
    } else {
      flattenHttpieArgs(body as Record<string, unknown>, '', parts);
    }
  } else if (body) {
    parts.push(`  <<< '${JSON.stringify(body)}'`);
  }
  
return parts.join(' \\\n');
}

export function generateSdk(
  op: TStackOperation,
  params?: Record<string, string>,
  body?: Record<string, unknown>
): string {
  const args: Record<string, unknown> = { ...(params ?? {}) };
  if (body && typeof body === 'object' && !Array.isArray(body))
    Object.assign(args, body);

  const argsBlock = Object.keys(args).length
    ? JSON.stringify(args, null, 2)
        .split('\n')
        .map((l, i) => (i === 0 ? l : '  ' + l))
        .join('\n')
    : '{}';

  return [
    `import { SDK } from '@formance/formance-sdk';`,
    ``,
    `const client = new SDK({ serverURL: process.env.FORMANCE_API_URL });`,
    ``,
    `const response = await client.${op.sdk.module}.${op.sdk.method}(${argsBlock});`,
  ].join('\n');
}
