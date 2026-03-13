import { TypographyH2, TypographyH3, TypographyP, TypographyInlineCode, TypographyList, TypographyListItem } from '@/registry/default/ui/typography';

export function ThemingContent() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <TypographyH2 id="light-dark">Light &amp; Dark Mode</TypographyH2>
        <TypographyP>
          The design system ships with light and dark themes. Theme switching is
          handled by <TypographyInlineCode>next-themes</TypographyInlineCode>{' '}
          using the <TypographyInlineCode>class</TypographyInlineCode> strategy.
          The <TypographyInlineCode>.dark</TypographyInlineCode> class on{' '}
          <TypographyInlineCode>&lt;html&gt;</TypographyInlineCode> toggles
          all CSS custom properties to their dark variants.
        </TypographyP>
      </section>

      <section className="space-y-4">
        <TypographyH2 id="css-variables">CSS Variables</TypographyH2>
        <TypographyP>
          All colors are defined as CSS custom properties using the OKLCh color
          space. This provides perceptually uniform color mixing and consistent
          contrast across palettes.
        </TypographyP>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4 space-y-2">
            <TypographyH3 className="text-sm">Layout Tokens</TypographyH3>
            <TypographyList className="my-0 ml-0 list-none text-sm text-muted-foreground font-mono">
              <TypographyListItem>--background</TypographyListItem>
              <TypographyListItem>--foreground</TypographyListItem>
              <TypographyListItem>--card / --card-foreground</TypographyListItem>
              <TypographyListItem>--popover / --popover-foreground</TypographyListItem>
              <TypographyListItem>--border</TypographyListItem>
              <TypographyListItem>--input</TypographyListItem>
              <TypographyListItem>--ring</TypographyListItem>
              <TypographyListItem>--radius</TypographyListItem>
            </TypographyList>
          </div>
          <div className="rounded-lg border p-4 space-y-2">
            <TypographyH3 className="text-sm">Semantic Tokens</TypographyH3>
            <TypographyList className="my-0 ml-0 list-none text-sm text-muted-foreground font-mono">
              <TypographyListItem>--primary / --primary-foreground</TypographyListItem>
              <TypographyListItem>--secondary / --secondary-foreground</TypographyListItem>
              <TypographyListItem>--muted / --muted-foreground</TypographyListItem>
              <TypographyListItem>--accent / --accent-foreground</TypographyListItem>
              <TypographyListItem>--destructive / --destructive-foreground</TypographyListItem>
              <TypographyListItem>--valid / --valid-foreground</TypographyListItem>
              <TypographyListItem>--warning / --warning-foreground</TypographyListItem>
              <TypographyListItem>--info / --info-foreground</TypographyListItem>
            </TypographyList>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <TypographyH2 id="customization">Customization</TypographyH2>
        <TypographyP>
          Override any CSS variable in your own{' '}
          <TypographyInlineCode>globals.css</TypographyInlineCode>{' '}
          to customize the theme. Brand palettes (emerald, lilac, gold, cobalt,
          mint) and all semantic colors can be replaced independently.
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
