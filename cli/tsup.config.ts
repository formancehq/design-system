import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  clean: true,
  minify: false,
  banner: { js: '#!/usr/bin/env node' },
  onSuccess: async () => {
    cpSync(resolve('src/templates'), resolve('dist/templates'), {
      recursive: true,
    });
  },
});
