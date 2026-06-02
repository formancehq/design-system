#!/usr/bin/env node
// Generates the `base` registry item from app/globals.css and patches
// registry.json in place. Runs cheaply; meant to be invoked manually after
// editing globals.css. Idempotent.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const css = readFileSync(join(ROOT, 'app', 'globals.css'), 'utf8');

const findBlock = (selector) => {
  const re = new RegExp(`${selector}\\s*\\{`, 'm');
  const m = css.match(re);
  if (!m) throw new Error(`block not found: ${selector}`);
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') depth--;
    i++;
  }
  
return css.slice(start, i - 1);
};

const parseDecls = (block) => {
  const out = {};
  for (const raw of block.split(';')) {
    const line = raw.trim();
    if (!line || line.startsWith('/*')) continue;
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    if (k.startsWith('--')) out[k.slice(2)] = v;
  }
  
return out;
};

const light = parseDecls(findBlock(':root'));
const dark = parseDecls(findBlock('\\.dark'));
const theme = parseDecls(findBlock('@theme inline'));

const baseItem = {
  name: 'base',
  type: 'registry:style',
  title: 'Formance Base',
  description:
    'Brand tokens, fonts, and Tailwind @theme mapping. Install with `formance-ds init`.',
  dependencies: ['tw-animate-css', '@tailwindcss/typography'],
  cssVars: { theme, light, dark },
  css: {
    "@plugin '@tailwindcss/typography'": {},
    "@import 'tw-animate-css'": {},
    "@import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap')":
      {},
    "@import url('https://ds.formance.com/fonts.css')": {},
    '@layer base': {
      '*': {
        'border-color': 'var(--border)',
        'outline-color': 'color-mix(in oklch, var(--ring) 50%, transparent)',
      },
      body: {
        'background-color': 'var(--color-muted-lighter)',
        color: 'var(--color-foreground)',
        'font-family': 'var(--font-sans)',
        'font-variation-settings': "'opsz' var(--font-opsz-text)",
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
        'font-optical-sizing': 'auto',
      },
      'h1, h2, h3, h4, h5, h6': {
        'font-variation-settings': "'opsz' var(--font-opsz-heading)",
      },
      ':not(pre) > code': {
        position: 'relative',
        'border-radius': 'var(--radius-sm)',
        'background-color': 'var(--color-muted)',
        padding: '0.2rem 0.3rem',
        'font-family': 'var(--font-mono)',
        'font-size': 'var(--text-sm)',
      },
      'button:not(:disabled), [role="button"]:not(:disabled)': {
        cursor: 'pointer',
      },
    },
    '@utility font-heading': {
      'font-variation-settings': "'opsz' var(--font-opsz-heading)",
    },
    '@utility font-text': {
      'font-variation-settings': "'opsz' var(--font-opsz-text)",
    },
    '@keyframes accordion-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' },
    },
    '@keyframes accordion-up': {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' },
    },
    '@keyframes collapsible-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-collapsible-content-height)' },
    },
    '@keyframes collapsible-up': {
      from: { height: 'var(--radix-collapsible-content-height)' },
      to: { height: '0' },
    },
  },
};

const registryPath = join(ROOT, 'registry.json');
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const existingIdx = registry.items.findIndex((i) => i.name === 'base');
if (existingIdx >= 0) registry.items[existingIdx] = baseItem;
else registry.items.unshift(baseItem);

writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(
  `wrote base item: ${Object.keys(light).length} light vars, ${Object.keys(dark).length} dark vars, ${Object.keys(theme).length} theme vars`
);
