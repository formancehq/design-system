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

// shadcn's add fetches every URL via Promise.all in a single process. Passing
// the full registry (~80+ URLs) at once triggers a DNS-resolver storm that
// reliably fails with ENOTFOUND. Chunks of ~20 keep each shadcn invocation
// fast (one npx spawn) while bounding concurrent fetches.
const CHUNK_SIZE = 20;

const runOnce = async (
  urls: string[],
  opts: TShadcnAddOptions,
  env: NodeJS.ProcessEnv
): Promise<number> => {
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

  const env = opts.insecure
    ? { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' }
    : process.env;

  if (urls.length <= CHUNK_SIZE) return runOnce(urls, opts, env);

  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    chunks.push(urls.slice(i, i + CHUNK_SIZE));
  }

  for (let i = 0; i < chunks.length; i++) {
    console.log(
      `\n[chunk ${i + 1}/${chunks.length}] installing ${chunks[i]!.length} components`
    );
    const code = await runOnce(chunks[i]!, opts, env);
    if (code !== 0) return code;
  }

  return 0;
}
