import { Command } from 'commander';

import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';

const program = new Command()
  .name('formance-ds')
  .description('CLI for installing Formance design system components.')
  .version('0.1.0');

program.addCommand(addCommand);
program.addCommand(listCommand);

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
