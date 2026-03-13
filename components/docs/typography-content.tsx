import { TypographyH2, TypographyH3, TypographyP, TypographyInlineCode, TypographySmall } from '@/registry/default/ui/typography';

export function TypographyContent() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <TypographyH2 id="typefaces">Typefaces</TypographyH2>
        <TypographyP>
          The design system uses three typefaces loaded from the Formance CDN.
        </TypographyP>

        <div className="space-y-6">
          <div className="rounded-lg border p-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <TypographyH3 className="text-lg">Polymath</TypographyH3>
              <TypographySmall className="font-mono text-muted-foreground">--font-sans (primary)</TypographySmall>
            </div>
            <p className="font-primary text-3xl font-light tracking-tight">
              The quick brown fox jumps over the lazy dog
            </p>
            <p className="font-primary text-3xl font-bold tracking-tight">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>

          <div className="rounded-lg border p-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <TypographyH3 className="text-lg">Figtree</TypographyH3>
              <TypographySmall className="font-mono text-muted-foreground">--font-sans (fallback)</TypographySmall>
            </div>
            <p style={{ fontFamily: 'Figtree' }} className="text-3xl font-light tracking-tight">
              The quick brown fox jumps over the lazy dog
            </p>
            <p style={{ fontFamily: 'Figtree' }} className="text-3xl font-bold tracking-tight">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>

          <div className="rounded-lg border p-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <TypographyH3 className="text-lg">Berkeley Mono</TypographyH3>
              <TypographySmall className="font-mono text-muted-foreground">--font-mono</TypographySmall>
            </div>
            <p className="font-mono text-2xl font-light">
              The quick brown fox jumps over the lazy dog
            </p>
            <p className="font-mono text-2xl font-bold">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <TypographyH2 id="scale">Type Scale</TypographyH2>
        <TypographyP>
          Standard type scale using Tailwind utility classes.
        </TypographyP>
        <div className="space-y-3 rounded-lg border p-6">
          {[
            { label: 'text-xs', className: 'text-xs' },
            { label: 'text-sm', className: 'text-sm' },
            { label: 'text-base', className: 'text-base' },
            { label: 'text-lg', className: 'text-lg' },
            { label: 'text-xl', className: 'text-xl' },
            { label: 'text-2xl', className: 'text-2xl' },
            { label: 'text-3xl', className: 'text-3xl' },
            { label: 'text-4xl', className: 'text-4xl' },
          ].map(({ label, className }) => (
            <div key={label} className="flex items-baseline gap-4">
              <TypographySmall className="w-20 shrink-0 font-mono text-muted-foreground">{label}</TypographySmall>
              <span className={className}>The quick brown fox</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <TypographyH2 id="usage">Usage</TypographyH2>
        <TypographyP>
          Buttons, badges, tabs, and other interactive elements use{' '}
          <TypographyInlineCode>font-mono</TypographyInlineCode>{' '}
          (Berkeley Mono) in uppercase. Body text and headings use{' '}
          <TypographyInlineCode>font-primary</TypographyInlineCode>{' '}
          (Polymath / Figtree).
        </TypographyP>
      </section>
    </div>
  );
}
