import { CodeBlock } from '@/components/code-block';
import { CollapsibleCode } from '@/components/collapsible-code';
import { TypographyH2, TypographyH3, TypographyP, TypographyInlineCode } from '@/registry/default/ui/typography';

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
  --emerald-200: oklch(0.9225 0.0096 196.99);
  --emerald-300: oklch(0.9001 0.0122 202.07);
  --emerald-400: oklch(0.8164 0.017 202);
  --emerald-500: oklch(0.6433 0.028 201.8);
  --emerald-600: oklch(0.4754 0.039 204.7);
  --emerald-700: oklch(0.3026 0.0516 208.89);
  --emerald-800: oklch(0.253 0.0427 208.02);
  --emerald-900: oklch(0.1879 0.032 202.57);

  --lilac-100: oklch(0.9747 0.0111 286.19);
  --lilac-200: oklch(0.9457 0.0274 288.16);
  --lilac-300: oklch(0.9181 0.0414 287.08);
  --lilac-400: oklch(0.8913 0.0558 287.5);
  --lilac-500: oklch(0.8635 0.070365 286.3527);
  --lilac-600: oklch(0.7401 0.0786 286.6);
  --lilac-700: oklch(0.5996 0.0915 284.81);
  --lilac-800: oklch(0.467 0.1001 284.09);
  --lilac-900: oklch(0.3246 0.1125 279.57);

  --gold-100: oklch(0.9007 0.0128 87.49);
  --gold-200: oklch(0.8142 0.0237 90.31);
  --gold-300: oklch(0.7306 0.0333 87.57);
  --gold-400: oklch(0.6401 0.0455 89);
  --gold-500: oklch(0.5448 0.0561 88.83);
  --gold-600: oklch(0.4637 0.046541 88.8573);
  --gold-700: oklch(0.3909 0.0391 88.86);
  --gold-800: oklch(0.2989 0.0257 87.46);
  --gold-900: oklch(0.2032 0.0143 87.54);

  --cobalt-100: oklch(0.922 0.0198 238.67);
  --cobalt-200: oklch(0.9219 0.0207 238.68);
  --cobalt-300: oklch(0.7538 0.0649 241.62);
  --cobalt-400: oklch(0.6744 0.0881 242.61);
  --cobalt-500: oklch(0.5609 0.102 244.23);
  --cobalt-600: oklch(0.5065 0.0908 244.14);
  --cobalt-700: oklch(0.4121 0.0702 243.8);
  --cobalt-800: oklch(0.323 0.0527 243.56);
  --cobalt-900: oklch(0.2168 0.0283 240.87);

  --mint-100: oklch(0.9753 0.0181 148.38);
  --mint-200: oklch(0.9567 0.0328 146.71);
  --mint-300: oklch(0.931 0.0485 146.07);
  --mint-400: oklch(0.913 0.0631 145.92);
  --mint-500: oklch(0.889 0.0812 145.7);
  --mint-600: oklch(0.7756 0.0752 146.09);
  --mint-700: oklch(0.6486 0.0683 146);
  --mint-800: oklch(0.5265 0.0674 145.34);
  --mint-900: oklch(0.3855 0.0614 145.02);
}`;

export function ThemingContent() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <TypographyH2 id="convention">Convention</TypographyH2>
        <TypographyP>
          Colors use a <TypographyInlineCode>background</TypographyInlineCode> /{' '}
          <TypographyInlineCode>foreground</TypographyInlineCode> naming convention.
          The <TypographyInlineCode>background</TypographyInlineCode> suffix is used
          for the background color and <TypographyInlineCode>foreground</TypographyInlineCode>{' '}
          for the text color.
        </TypographyP>
        <CodeBlock
          code={`<div className="bg-primary text-primary-foreground">Hello</div>`}
          lang="tsx"
        />
        <TypographyP>
          All colors are defined as CSS custom properties using the OKLCh color
          space. This provides perceptually uniform color mixing and consistent
          contrast across palettes.
        </TypographyP>
      </section>

      <section className="space-y-4">
        <TypographyH2 id="css-variables">CSS Variables</TypographyH2>
        <TypographyP>
          Here is the full list of CSS variables used by the design system.
        </TypographyP>

        <TypographyH3 id="light-mode">Light Mode</TypographyH3>
        <CollapsibleCode>
          <CodeBlock code={LIGHT_VARIABLES} lang="css" />
        </CollapsibleCode>

        <TypographyH3 id="dark-mode">Dark Mode</TypographyH3>
        <CollapsibleCode>
          <CodeBlock code={DARK_VARIABLES} lang="css" />
        </CollapsibleCode>
      </section>

      <section className="space-y-4">
        <TypographyH2 id="brand-palettes">Brand Palettes</TypographyH2>
        <TypographyP>
          Five brand color palettes (Emerald, Lilac, Gold, Cobalt, Mint) with
          full shade scales. These are the raw OKLCh values that semantic tokens
          reference.
        </TypographyP>
        <CollapsibleCode>
          <CodeBlock code={BRAND_PALETTES} lang="css" />
        </CollapsibleCode>
      </section>

      <section className="space-y-4">
        <TypographyH2 id="customization">Customization</TypographyH2>
        <TypographyP>
          Override any CSS variable in your own{' '}
          <TypographyInlineCode>globals.css</TypographyInlineCode>{' '}
          to customize the theme. Brand palettes and all semantic colors can be
          replaced independently.
        </TypographyP>
        <TypographyP>
          The Tailwind v4{' '}
          <TypographyInlineCode>@theme inline</TypographyInlineCode>{' '}
          block maps every CSS variable to a Tailwind utility, so{' '}
          <TypographyInlineCode>bg-emerald-500</TypographyInlineCode>{' '}
          and similar classes work automatically.
        </TypographyP>
      </section>
    </div>
  );
}
