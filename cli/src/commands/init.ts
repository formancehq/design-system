import { Command } from 'commander';

import {
  componentUrl,
  DEFAULT_REGISTRY,
  fetchRegistryIndex,
} from '../lib/registry.js';
import { rewriteFragmentImports } from '../lib/rewrite-fragment-imports.js';
import {
  rewriteGlobalsFromTemplate,
  writeGlobalsFromTemplate,
} from '../lib/rewrite-globals.js';
import { runShadcnAdd } from '../lib/shadcn.js';

type TInitOptions = {
  all?: boolean;
  registry: string;
  cwd?: string;
  overwrite?: boolean;
  yes?: boolean;
  insecure?: boolean;
  internal?: boolean;
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
  .option(
    '--internal',
    'Keep Formance CDN fonts (Polymath, Berkeley Mono). Off by default.'
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
      const cwd = options.cwd ?? process.cwd();
      const rewritten = options.overwrite
        ? writeGlobalsFromTemplate(cwd, { internal: options.internal })
        : rewriteGlobalsFromTemplate(cwd, { internal: options.internal });
      if (rewritten) console.log(`✔ Rewrote ${rewritten} from template`);

      const fragmentResult = await rewriteFragmentImports(
        options.cwd ?? process.cwd(),
        base,
        names
      );
      if (fragmentResult.replacements > 0) {
        console.log(
          `✔ Rewrote ${fragmentResult.replacements} fragment import${fragmentResult.replacements === 1 ? '' : 's'} across ${fragmentResult.filesChanged} file${fragmentResult.filesChanged === 1 ? '' : 's'}`
        );
      }
    }

    process.exitCode = exitCode;
  });
