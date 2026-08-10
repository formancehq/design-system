import { readFileSync } from 'node:fs';

import type { KnipConfig } from 'knip';

type TRegistryManifest = {
  items?: { files?: { path: string }[] }[];
};

const manifest: TRegistryManifest = JSON.parse(
  readFileSync('registry.json', 'utf8')
);

/**
 * Every file shipped through registry.json is a public entry point: consumers
 * install it with `shadcn add`, so its exports have no in-repo caller. The `!`
 * suffix also marks those exports as public API.
 */
const registryEntry: string[] = [];
for (const item of manifest.items ?? []) {
  for (const file of item.files ?? []) {
    registryEntry.push(`${file.path}!`);
  }
}

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: [
        'app/**/{page,layout,route,not-found,error,global-error,loading,template,default,sitemap,robots,opengraph-image,icon,apple-icon,manifest}.{ts,tsx}',
        'doctor.config.js',
        'scripts/*.{ts,mjs}',
        'content/**/*.mdx',
        ...registryEntry,
      ],
      project: ['**/*.{ts,tsx,mjs,js}'],
      // Referenced from app/globals.css, which knip does not parse.
      ignoreDependencies: [
        'tailwindcss',
        '@tailwindcss/typography',
        'tw-animate-css',
      ],
    },
    cli: {
      project: ['src/**/*.ts'],
      // The CLI is standalone with its own lockfile, so the root QA job never
      // installs cli/node_modules and cannot resolve its build binary. It is a
      // declared devDependency there; the CLI job typechecks and builds it.
      ignoreBinaries: ['tsup'],
    },
  },
};

export default config;
