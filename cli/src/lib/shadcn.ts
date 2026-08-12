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

export type TShadcnAddResult = {
  exitCode: number;
  /** URLs shadcn could not install, after isolating each one. */
  failed: string[];
};

// shadcn resolves every URL it is handed before it writes any of them, so one
// unresolvable component fails the whole invocation and none of the batch lands.
// A chunk that fails is therefore retried an item at a time: the bad component
// is isolated and named, and its 19 neighbours still install. The run continues
// through the remaining chunks either way — aborting here is what let a failure
// early in `--all` silently leave every later component at its installed
// version, with no signal beyond a nonzero exit code buried under 94 components
// of output.
const runIsolated = async (
  urls: string[],
  opts: TShadcnAddOptions,
  env: NodeJS.ProcessEnv
): Promise<string[]> => {
  const failed: string[] = [];
  for (const url of urls) {
    if ((await runOnce([url], opts, env)) !== 0) failed.push(url);
  }

  return failed;
};

export async function runShadcnAdd(
  urls: string[],
  opts: TShadcnAddOptions = {}
): Promise<TShadcnAddResult> {
  if (urls.length === 0) {
    throw new Error('No component URLs provided to shadcn add.');
  }

  const env = opts.insecure
    ? { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' }
    : process.env;

  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    chunks.push(urls.slice(i, i + CHUNK_SIZE));
  }

  const failed: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    if (chunks.length > 1) {
      console.log(
        `\n[chunk ${i + 1}/${chunks.length}] installing ${chunk.length} components`
      );
    }
    if ((await runOnce(chunk, opts, env)) === 0) continue;

    if (chunk.length === 1) {
      failed.push(chunk[0]!);
      continue;
    }
    console.log(
      `[chunk ${i + 1}/${chunks.length}] failed as a batch — retrying its ${chunk.length} components one at a time`
    );
    failed.push(...(await runIsolated(chunk, opts, env)));
  }

  return { exitCode: failed.length > 0 ? 1 : 0, failed };
}
