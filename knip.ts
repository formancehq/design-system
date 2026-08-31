import { readFileSync } from 'node:fs';

import type { KnipConfig } from 'knip';

type TRegistryManifest = {
  items?: { files?: { path: string }[] }[];
};

const manifest: TRegistryManifest = JSON.parse(
  readFileSync('registry.json', 'utf8')
);

/**
 * Every file shipped through registry.json is an entry point: consumers install
 * it with `shadcn add`, so its exports have no in-repo caller. Listing it as an
 * entry is what keeps those exports out of the report — knip skips unused
 * exports in entry files unless `includeEntryExports` is on. The `!` suffix is
 * separate: it marks the pattern as a production entry, so `knip --production`
 * sees the shipped files too.
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
      // CSS is in the graph on purpose: `tailwindcss`, `tw-animate-css` and
      // `@tailwindcss/typography` are pulled in by `app/globals.css` alone, so
      // leaving stylesheets out reports all three as unused dependencies.
      // `public/` is served verbatim by Next and is referenced from HTML/CDN
      // URLs, never imported, so it is not part of the module graph.
      // `.design-sync/` is input for the external design-sync tool, not for this
      // app: its previews, lib fork and stylesheet entry are read by that tool
      // from outside the repo, so nothing here can ever import them.
      project: ['**/*.{ts,tsx,mjs,js,css}', '!public/**', '!.design-sync/**'],
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
