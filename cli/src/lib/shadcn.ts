import { execa } from 'execa';

export type TShadcnAddOptions = {
  cwd?: string;
  overwrite?: boolean;
  yes?: boolean;
  insecure?: boolean;
};

const buildArgs = (urls: string[], opts: TShadcnAddOptions): string[] => {
  const args = ['-y', 'shadcn@latest', 'add', ...urls];
  if (opts.overwrite) args.push('--overwrite');
  if (opts.yes) args.push('--yes');
  if (opts.cwd) args.push('--cwd', opts.cwd);
  
return args;
};

const runOnce = async (
  urls: string[],
  opts: TShadcnAddOptions
): Promise<number> => {
  const env = opts.insecure
    ? { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' }
    : process.env;
  const result = await execa('npx', buildArgs(urls, opts), {
    stdio: 'inherit',
    reject: false,
    env,
  });
  
return result.exitCode ?? 1;
};

export async function runShadcnAdd(
  urls: string[],
  opts: TShadcnAddOptions = {}
): Promise<number> {
  if (urls.length === 0) {
    throw new Error('No component URLs provided to shadcn add.');
  }

  // shadcn's --overwrite is unreliable when many URLs are passed in one call
  // (it silently "Skipped" many files). Solo installs honor the flag, so when
  // overwrite is requested we install components one at a time.
  if (opts.overwrite && urls.length > 1) {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]!;
      console.log(`\n[${i + 1}/${urls.length}] ${url}`);
      const code = await runOnce([url], opts);
      if (code !== 0) return code;
    }
    
return 0;
  }

  return runOnce(urls, opts);
}
