import { Command } from 'commander';

import { normalizeGlobalsCss } from '../lib/normalize-globals.js';
import {
  componentUrl,
  DEFAULT_REGISTRY,
  fetchRegistryIndex,
} from '../lib/registry.js';
import { runShadcnAdd } from '../lib/shadcn.js';

type TInitOptions = {
  all?: boolean;
  registry: string;
  cwd?: string;
  overwrite?: boolean;
  yes?: boolean;
  insecure?: boolean;
};

const BASE_ITEM = 'base';

export const initCommand = new Command('init')
  .description(
    'Install Formance base styles, tokens, and fonts. Add --all to also install every component.'
  )
  .option('--all', 'Also install every component in the registry')
  .option('--registry <url>', 'Registry base URL', DEFAULT_REGISTRY)
  .option('--cwd <path>', 'Target project directory')
  .option('--overwrite', 'Overwrite existing files')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option(
    '--insecure',
    'Accept self-signed TLS certs (for local-dev registries)'
  )
  .action(async (options: TInitOptions) => {
    if (options.insecure) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const base = options.registry;
    const names: string[] = [BASE_ITEM];

    if (options.all) {
      const index = await fetchRegistryIndex(base);
      for (const item of index.items) {
        if (item.name !== BASE_ITEM) names.push(item.name);
      }
      console.log(
        `Installing base + ${names.length - 1} components from ${base}\n`
      );
    } else {
      console.log(`Installing base from ${base}\n`);
    }

    const urls = names.map((name) => componentUrl(base, name));
    const exitCode = await runShadcnAdd(urls, {
      cwd: options.cwd,
      overwrite: options.overwrite,
      yes: options.yes,
      insecure: options.insecure,
    });

    if (exitCode === 0) {
      const normalized = normalizeGlobalsCss(options.cwd ?? process.cwd());
      if (normalized) console.log(`✔ Normalized ${normalized}`);
    }

    process.exitCode = exitCode;
  });
