import { execa } from 'execa';

export type TShadcnAddOptions = {
  cwd?: string;
  overwrite?: boolean;
  yes?: boolean;
  insecure?: boolean;
};

export async function runShadcnAdd(
  urls: string[],
  opts: TShadcnAddOptions = {}
): Promise<number> {
  if (urls.length === 0) {
    throw new Error('No component URLs provided to shadcn add.');
  }

  const args = ['-y', 'shadcn@latest', 'add', ...urls];
  if (opts.overwrite) args.push('--overwrite');
  if (opts.yes) args.push('--yes');
  if (opts.cwd) args.push('--cwd', opts.cwd);

  const env = opts.insecure
    ? { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' }
    : process.env;

  const result = await execa('npx', args, {
    stdio: 'inherit',
    reject: false,
    env,
  });
  
return result.exitCode ?? 1;
}
