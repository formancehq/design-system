import { Command } from 'commander';

import { DEFAULT_REGISTRY, fetchRegistryIndex } from '../lib/registry.js';

type TListOptions = {
  registry: string;
  json?: boolean;
};

export const listCommand = new Command('list')
  .description('List all available components in the registry.')
  .option('--registry <url>', 'Registry base URL', DEFAULT_REGISTRY)
  .option('--json', 'Output as JSON')
  .action(async (options: TListOptions) => {
    const index = await fetchRegistryIndex(options.registry);

    if (options.json) {
      console.log(JSON.stringify(index.items, null, 2));
      
return;
    }

    const nameWidth = Math.max(...index.items.map((i) => i.name.length), 4);
    for (const item of index.items) {
      const name = item.name.padEnd(nameWidth);
      const description = item.description ?? '';
      console.log(`  ${name}  ${description}`);
    }
    console.log(`\n${index.items.length} components at ${options.registry}`);
  });
