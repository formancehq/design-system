import { type TCodeLanguage } from '@/registry/default/ui/code/code-themes';

/**
 * A node in the navigation tree.
 * Each node represents a navigable section in the code (a key that contains
 * nested structure). Leaf scalars (e.g. `name: "foo"`) are excluded — only
 * keys that open objects, arrays, or blocks appear in the tree.
 */
export type TNavigationNode = {
  /** Display name — the key name, or the value of name/id/slug for array items */
  key: string;
  /** 1-based line number in the source content */
  line: number;
  /** Child nodes (deeper nesting levels) */
  children: TNavigationNode[];
};

/**
 * Build a navigation tree from formatted JSON or YAML content.
 *
 * The tree is used by `CodeNavigator` to render a breadcrumb of selects
 * that let users jump to any section in the editor.
 *
 * How it works:
 * - Line-by-line scan using indentation to determine parent→child relationships
 * - A stack tracks the current nesting path; when a line has shallower indent
 *   than the stack top, the stack pops back to the correct parent
 * - Leaf values (scalars) are skipped — they aren't useful navigation targets
 * - Array items (`- name: foo` in YAML, standalone `{` in JSON) are identified
 *   by looking for `name`, `id`, or `slug` fields
 *
 * Assumes machine-formatted input:
 * - JSON from `JSON.stringify(x, null, 2)` → 2-space indent
 * - YAML from `yamlDump()` → 2-space indent
 */
export function parseNavigationTree(
  content: string,
  language: TCodeLanguage
): TNavigationNode[] {
  if (language === 'json') return parseJson(content);
  if (language === 'yaml') return parseYaml(content);

  return [];
}

// Keys used to identify array items by their value
// e.g. `- name: gift-card-ledger` → node named "gift-card-ledger"
const IDENTIFIER_KEYS = new Set(['name', 'id', 'slug']);

// ─── YAML ──────────────────────────────────────────────────────────────────────
//
// Indent determines nesting:
//   `ledgers:`          (indent 0) → root node
//   `  - name: foo`     (indent 2, array item) → child of ledgers, named "foo"
//   `    schema:`       (indent 4) → child of the array item
//   `      1.0.1:`      (indent 6) → child of schema
//
// Skipped lines:
//   - Empty / comments
//   - Leaf scalars: `key: value` where value is non-empty
//   - Multiline blocks: `key: |` or `key: >` and their indented body

function parseYaml(content: string): TNavigationNode[] {
  const lines = content.split('\n');
  const root: TNavigationNode[] = [];
  const stack: { indent: number; children: TNavigationNode[] }[] = [
    { indent: -1, children: root },
  ];
  let skipUntilIndent = -1;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!;
    const trimmed = raw.trimStart();

    if (trimmed === '' || trimmed.startsWith('#')) continue;

    const indent = raw.length - trimmed.length;

    // Inside a multiline block (| or >) — skip until indent returns
    if (skipUntilIndent >= 0) {
      if (indent > skipUntilIndent) continue;
      skipUntilIndent = -1;
    }

    // Strip array item prefix: `- key: value` → `key: value`
    const isArrayItem = trimmed.startsWith('- ');
    const keyContent = isArrayItem ? trimmed.slice(2) : trimmed;

    const match = keyContent.match(/^([^:]+?):\s*(.*)/);
    if (!match) continue;

    const key = match[1]!.trim();
    const value = match[2]!.trim();
    if (!key) continue;

    // Multiline scalar block — not navigable
    if (value === '|' || value === '>') {
      skipUntilIndent = indent;
      continue;
    }

    // Leaf scalar (has inline value) — not navigable
    const isLeaf = value !== '';

    // Pop stack back to the parent at a shallower indent
    while (stack.length > 1 && stack[stack.length - 1]!.indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1]!;

    // Array items get named by their identifier field value
    if (isArrayItem) {
      const displayKey = IDENTIFIER_KEYS.has(key) ? value || key : key;
      const node: TNavigationNode = {
        key: displayKey,
        line: i + 1,
        children: [],
      };
      parent.children.push(node);
      stack.push({ indent, children: node.children });
      continue;
    }

    if (isLeaf) continue;

    // Non-leaf key — push as a navigable node
    const node: TNavigationNode = { key, line: i + 1, children: [] };
    parent.children.push(node);
    stack.push({ indent, children: node.children });
  }

  return root;
}

// ─── JSON ──────────────────────────────────────────────────────────────────────
//
// Three line patterns matter:
//   `"key": {` or `"key": [`  → non-leaf key, opens nested structure
//   `{` alone (indent > 0)    → array item object, named by lookahead
//   everything else           → leaf value or bracket — skipped
//
// The root `{` at indent 0 is ignored (it's the outer object wrapper).

function parseJson(content: string): TNavigationNode[] {
  const lines = content.split('\n');
  const root: TNavigationNode[] = [];
  const stack: { indent: number; children: TNavigationNode[] }[] = [
    { indent: -1, children: root },
  ];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]!;
    const trimmed = raw.trimStart();
    const indent = raw.length - trimmed.length;

    // Non-leaf key opening an object or array
    const nonLeafMatch = trimmed.match(/^"([^"]+)":\s*(?:\{|\[)/);
    if (nonLeafMatch) {
      while (stack.length > 1 && stack[stack.length - 1]!.indent >= indent) {
        stack.pop();
      }
      const parent = stack[stack.length - 1]!;
      const node: TNavigationNode = {
        key: nonLeafMatch[1]!,
        line: i + 1,
        children: [],
      };
      parent.children.push(node);
      stack.push({ indent, children: node.children });
      continue;
    }

    // Standalone { inside an array (not the root object at indent 0)
    // Look one line ahead for a name/id/slug field to use as display name
    if (trimmed === '{' && indent > 0) {
      while (stack.length > 1 && stack[stack.length - 1]!.indent >= indent) {
        stack.pop();
      }

      let displayKey = '[item]';
      const nextLine = lines[i + 1];
      if (nextLine) {
        const identMatch = nextLine
          .trimStart()
          .match(/^"([^"]+)":\s*"([^"]+)"/);
        if (identMatch && IDENTIFIER_KEYS.has(identMatch[1]!)) {
          displayKey = identMatch[2]!;
        }
      }

      const parent = stack[stack.length - 1]!;
      const node: TNavigationNode = {
        key: displayKey,
        line: i + 1,
        children: [],
      };
      parent.children.push(node);
      stack.push({ indent, children: node.children });
      continue;
    }
  }

  return root;
}
