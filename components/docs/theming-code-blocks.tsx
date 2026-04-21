import { CodeBlock } from '@/components/code-block';
import { CollapsibleCode } from '@/components/collapsible-code';

const LIGHT_VARIABLES = `:root {
  --font-sans: 'Polymath', 'Figtree', sans-serif;
  --font-mono: 'Berkeley Mono', 'Space Mono', monospace;

  --radius: 0.27rem;

  --background: var(--emerald-70);
  --foreground: var(--black);

  --primary: var(--emerald-700);
  --primary-foreground: var(--white);

  --secondary: var(--emerald-100);
  --secondary-foreground: var(--foreground);

  --muted: var(--secondary);
  --muted-foreground: var(--emerald-600);

  --accent: var(--secondary);
  --accent-foreground: var(--primary);

  --card: var(--white);
  --card-foreground: var(--foreground);

  --popover: var(--white);
  --popover-foreground: var(--foreground);

  --border: var(--emerald-200);
  --input: var(--emerald-200);
  --ring: var(--emerald-500);

  --destructive: var(--red-background);
  --destructive-foreground: var(--red-foreground);

  --valid: var(--green-background);
  --valid-foreground: var(--green-foreground);

  --warning: var(--amber-background);
  --warning-foreground: var(--amber-foreground);

  --info: var(--sky-background);
  --info-foreground: var(--sky-foreground);

  --sidebar: var(--white);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--emerald-400);
  --sidebar-primary-foreground: var(--white);
  --sidebar-accent: var(--accent);
  --sidebar-accent-foreground: var(--foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);

  --chart-1: var(--emerald-600);
  --chart-2: var(--lilac-600);
  --chart-3: var(--gold-500);
  --chart-4: var(--cobalt-500);
  --chart-5: var(--mint-500);
}`;

const DARK_VARIABLES = `.dark {
  --background: var(--emerald-900);
  --foreground: var(--white);

  --primary: var(--emerald-700);
  --primary-foreground: var(--white);

  --secondary: var(--emerald-300);
  --secondary-foreground: var(--emerald-900);

  --muted: var(--black);
  --muted-foreground: var(--emerald-300);

  --accent: var(--emerald-700);
  --accent-foreground: var(--emerald-100);

  --card: var(--black);
  --card-foreground: var(--foreground);

  --popover: var(--black);
  --popover-foreground: var(--foreground);

  --border: var(--emerald-700);
  --input: var(--emerald-700);
  --ring: var(--emerald-500);

  --destructive: var(--red-background);
  --destructive-foreground: var(--red-foreground);

  --valid: var(--green-background);
  --valid-foreground: var(--green-foreground);

  --warning: var(--amber-background);
  --warning-foreground: var(--amber-foreground);

  --info: var(--sky-background);
  --info-foreground: var(--sky-foreground);

  --sidebar: var(--black);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--emerald-500);
  --sidebar-primary-foreground: var(--white);
  --sidebar-accent: var(--accent);
  --sidebar-accent-foreground: var(--accent-foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);
}`;

const BRAND_PALETTES = `:root {
  --emerald-50: oklch(1 0 0);
  --emerald-70: oklch(0.9788 0.0023 197.12);
  --emerald-100: oklch(0.9503 0.0053 197.07);
  /* ... full scale ... */
  --emerald-900: oklch(0.1879 0.032 202.57);

  --lilac-100: oklch(0.9747 0.0111 286.19);
  /* ... */
  --lilac-900: oklch(0.3246 0.1125 279.57);

  --gold-100: oklch(0.9007 0.0128 87.49);
  /* ... */
  --gold-900: oklch(0.2032 0.0143 87.54);

  --cobalt-100: oklch(0.922 0.0198 238.67);
  /* ... */
  --cobalt-900: oklch(0.2168 0.0283 240.87);

  --mint-100: oklch(0.9753 0.0181 148.38);
  /* ... */
  --mint-900: oklch(0.3855 0.0614 145.02);
}`;

export function LightVariables() {
  return (
    <CollapsibleCode>
      <CodeBlock code={LIGHT_VARIABLES} lang="css" />
    </CollapsibleCode>
  );
}

export function DarkVariables() {
  return (
    <CollapsibleCode>
      <CodeBlock code={DARK_VARIABLES} lang="css" />
    </CollapsibleCode>
  );
}

export function BrandPaletteVariables() {
  return (
    <CollapsibleCode>
      <CodeBlock code={BRAND_PALETTES} lang="css" />
    </CollapsibleCode>
  );
}
