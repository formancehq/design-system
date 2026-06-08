import { Command } from 'commander';

import {
  componentUrl,
  DEFAULT_REGISTRY,
  fetchRegistryIndex,
} from '../lib/registry.js';
import { ensureFragmentDependencies } from '../lib/ensure-fragment-deps.js';
import { rewriteFragmentImports } from '../lib/rewrite-fragment-imports.js';
import { runShadcnAdd } from '../lib/shadcn.js';

type TAddOptions = {
  all?: boolean;
  registry: string;
  cwd?: string;
  overwrite?: boolean;
  yes?: boolean;
  insecure?: boolean;
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
    const exitCode = await runShadcnAdd(urls, {
      cwd: options.cwd,
      overwrite: options.overwrite,
      yes: options.yes,
      insecure: options.insecure,
    });

    if (exitCode === 0) {
      const cwd = options.cwd ?? process.cwd();
      const result = await rewriteFragmentImports(cwd, base, names);
      if (result.replacements > 0) {
        console.log(
          `✔ Rewrote ${result.replacements} fragment import${result.replacements === 1 ? '' : 's'} across ${result.filesChanged} file${result.filesChanged === 1 ? '' : 's'}`
        );
      }

      const depsResult = await ensureFragmentDependencies(cwd, base, names);
      if (depsResult.added.length > 0) {
        console.log(
          `✔ Added ${depsResult.added.length} fragment dependenc${depsResult.added.length === 1 ? 'y' : 'ies'} to package.json: ${depsResult.added.join(', ')}`
        );
        console.log('  Run your package manager install to fetch them.');
      }
    }

    process.exitCode = exitCode;
  });
