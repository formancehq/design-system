import { Command } from 'commander';

import {
  componentUrl,
  DEFAULT_REGISTRY,
  fetchRegistryIndex,
} from '../lib/registry.js';
import { ensureFragmentDependencies } from '../lib/ensure-fragment-deps.js';
import { rewriteFragmentImports } from '../lib/rewrite-fragment-imports.js';
import { writeGlobalsFromTemplate } from '../lib/rewrite-globals.js';
import { runShadcnAdd } from '../lib/shadcn.js';

type TAddOptions = {
  all?: boolean;
  registry: string;
  cwd?: string;
  overwrite?: boolean;
  yes?: boolean;
  insecure?: boolean;
  internal?: boolean;
};

export const addCommand = new Command('add')
  .description('Add Formance design system components to your project.')
  .argument(
    '[components...]',
    'Component names to install (e.g. button card input)'
  )
  .option('--all', 'Install every component in the registry')
  .option('--registry <url>', 'Registry base URL', DEFAULT_REGISTRY)
  .option('--cwd <path>', 'Target project directory')
  .option('--overwrite', 'Overwrite existing files')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option(
    '--insecure',
    'Accept self-signed TLS certs (for local-dev registries)'
  )
  .option(
    '--internal',
    'Keep Formance CDN fonts (Polymath, Berkeley Mono) when rewriting globals.css with --overwrite. Off by default.'
  )
  .action(async (components: string[], options: TAddOptions) => {
    if (options.insecure) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const base = options.registry;

    let names: string[];
    if (options.all) {
      const index = await fetchRegistryIndex(base);
      names = index.items.map((item) => item.name);
      console.log(`Installing ${names.length} components from ${base}\n`);
    } else if (components.length > 0) {
      names = components;
    } else {
      console.error('Error: provide component names or use --all.');
      process.exitCode = 1;

      return;
    }

    const urls = names.map((name) => componentUrl(base, name));
    const { exitCode, failed } = await runShadcnAdd(urls, {
      cwd: options.cwd,
      overwrite: options.overwrite,
      yes: options.yes,
      insecure: options.insecure,
    });

    // A failed URL maps back to its component by basename: `componentUrl` is the
    // only thing that built it.
    const failedNames = new Set(
      failed.map((url) =>
        url
          .split('/')
          .pop()!
          .replace(/\.json$/, '')
      )
    );
    const installed = names.filter((name) => !failedNames.has(name));

    const cwd = options.cwd ?? process.cwd();

    // Rewrite globals.css whenever --overwrite is set, regardless of exitCode:
    // it is template-driven and must not be skipped when a single component in
    // --all fails to install.
    if (options.overwrite) {
      const rewritten = writeGlobalsFromTemplate(cwd, {
        internal: options.internal,
      });
      if (rewritten) console.log(`✔ Rewrote ${rewritten} from template`);
      else
        console.warn(
          '⚠ Could not rewrite globals.css: no components.json with a tailwind.css entry found at the target. Pass --cwd <project-with-components.json>.'
        );
    }

    // Fragment import/dependency rewriting operates on freshly installed files,
    // so it runs over the components that landed rather than over everything
    // asked for — a partial install still needs its imports rewritten, or the
    // files that did land are left importing paths that don't resolve.
    if (installed.length > 0) {
      const result = await rewriteFragmentImports(cwd, base, installed);
      if (result.replacements > 0) {
        console.log(
          `✔ Rewrote ${result.replacements} fragment import${result.replacements === 1 ? '' : 's'} across ${result.filesChanged} file${result.filesChanged === 1 ? '' : 's'}`
        );
      }

      const depsResult = await ensureFragmentDependencies(cwd, base, installed);
      if (depsResult.added.length > 0) {
        console.log(
          `✔ Added ${depsResult.added.length} fragment dependenc${depsResult.added.length === 1 ? 'y' : 'ies'} to package.json: ${depsResult.added.join(', ')}`
        );
        console.log('  Run your package manager install to fetch them.');
      }
    }

    // The last thing printed, by name. `--all` scrolls ~94 components past the
    // terminal, so a component that didn't land has to say so at the end or it
    // reads as a success and the project keeps the version it already had.
    if (failedNames.size > 0) {
      console.error(
        `\n✖ ${failedNames.size} of ${names.length} component${names.length === 1 ? '' : 's'} did not install: ${[...failedNames].join(', ')}`
      );
      console.error(
        '  Everything else installed. Re-run with just those names to see the error on its own.'
      );
    } else {
      console.log(`\n✔ Installed ${installed.length} components`);
    }

    process.exitCode = exitCode;
  });
