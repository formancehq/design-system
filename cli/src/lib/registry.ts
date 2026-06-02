export const DEFAULT_REGISTRY = 'https://ds.formance.com/r';

export type TRegistryItem = {
  name: string;
  title?: string;
  description?: string;
  type?: string;
};

export type TRegistryIndex = {
  name?: string;
  homepage?: string;
  items: TRegistryItem[];
};

export async function fetchRegistryIndex(
  base: string
): Promise<TRegistryIndex> {
  const url = `${stripTrailingSlash(base)}/registry.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch registry index from ${url} (HTTP ${res.status})`
    );
  }
  const json = (await res.json()) as TRegistryIndex;
  if (!json.items || !Array.isArray(json.items)) {
    throw new Error(`Registry at ${url} is missing an "items" array.`);
  }
  
return json;
}

export function componentUrl(base: string, name: string): string {
  return `${stripTrailingSlash(base)}/${name}.json`;
}

function stripTrailingSlash(s: string): string {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}
