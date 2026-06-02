import { Command } from 'commander';

import {
  componentUrl,
  DEFAULT_REGISTRY,
  fetchRegistryIndex,
} from '../lib/registry.js';
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
    process.exitCode = exitCode;
  });
