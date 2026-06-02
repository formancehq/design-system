import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

type TComponentsJson = {
  tailwind?: { css?: string };
};

const isImportLine = (line: string) =>
  /^\s*@import\b/.test(line) || /^\s*@charset\b/.test(line);

const normalizeKey = (line: string) =>
  line.trim().replace(/['"]/g, '"').replace(/\s+/g, ' ');

export function normalizeGlobalsCss(cwd: string): string | null {
  const componentsJsonPath = join(cwd, 'components.json');
  if (!existsSync(componentsJsonPath)) return null;

  const config = JSON.parse(
    readFileSync(componentsJsonPath, 'utf8')
  ) as TComponentsJson;
  const cssRel = config.tailwind?.css;
  if (!cssRel) return null;

  const cssAbs = resolve(cwd, cssRel);
  if (!existsSync(cssAbs)) return null;

  const original = readFileSync(cssAbs, 'utf8');
  const lines = original.split('\n');
  const urlImports: string[] = [];
  const pkgImports: string[] = [];
  const seen = new Set<string>();
  const rest: string[] = [];

  for (const line of lines) {
    if (isImportLine(line)) {
      const key = normalizeKey(line);
      if (!seen.has(key)) {
        seen.add(key);
        if (/@import\s+url\(/.test(line)) urlImports.push(line.trim());
        else pkgImports.push(line.trim());
      }
    } else {
      rest.push(line);
    }
  }

  while (rest.length > 0 && rest[0].trim() === '') rest.shift();

  const imports = [...urlImports, ...pkgImports];
  const normalized = `${imports.join('\n')}\n\n${rest.join('\n')}`;
  if (normalized === original) return null;

  writeFileSync(cssAbs, normalized);
  
return cssAbs;
}
