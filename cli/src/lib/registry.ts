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

export type TRegistryFile = {
  path: string;
  target?: string;
};

export type TRegistryItemDetail = {
  name: string;
  files?: TRegistryFile[];
  dependencies?: string[];
  devDependencies?: string[];
};

const itemCache = new Map<string, Promise<TRegistryItemDetail | null>>();

export function fetchRegistryItem(
  base: string,
  name: string
): Promise<TRegistryItemDetail | null> {
  const key = componentUrl(base, name);
  const cached = itemCache.get(key);
  if (cached) return cached;
  const promise = (async () => {
    const res = await fetch(key);
    if (!res.ok) return null;

    return (await res.json()) as TRegistryItemDetail;
  })();
  itemCache.set(key, promise);

  return promise;
}

export function fetchRegistryItems(
  base: string,
  names: string[]
): Promise<Array<TRegistryItemDetail | null>> {
  return Promise.all(names.map((name) => fetchRegistryItem(base, name)));
}

function stripTrailingSlash(s: string): string {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}
