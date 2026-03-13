import { TypographyH2, TypographyH3, TypographyP, TypographySmall } from '@/registry/default/ui/typography';

const BRAND_PALETTES = [
  { name: 'Emerald', prefix: 'emerald', shades: ['50', '70', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Lilac', prefix: 'lilac', shades: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Gold', prefix: 'gold', shades: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Cobalt', prefix: 'cobalt', shades: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  { name: 'Mint', prefix: 'mint', shades: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
];

const SEMANTIC_COLORS = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'zinc',
];

function Swatch({ varName, label }: { varName: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="h-10 w-10 rounded-md border"
        style={{ backgroundColor: `var(--${varName})` }}
      />
      <TypographySmall className="text-[10px] font-mono text-muted-foreground">{label}</TypographySmall>
    </div>
  );
}

export function ColorsContent() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <TypographyH2 id="brand-palettes">Brand Palettes</TypographyH2>
        <TypographyP>
          Five brand color palettes defined in OKLCh color space for perceptual uniformity.
        </TypographyP>
        {BRAND_PALETTES.map((palette) => (
          <div key={palette.name} className="space-y-2">
            <TypographyH3 className="text-sm">{palette.name}</TypographyH3>
            <div className="flex flex-wrap gap-2">
              {palette.shades.map((shade) => (
                <Swatch
                  key={shade}
                  varName={`${palette.prefix}-${shade}`}
                  label={shade}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <TypographyH2 id="semantic-colors">Semantic Colors</TypographyH2>
        <TypographyP>
          Semantic color pairs (background + foreground) for status indicators, alerts, and badges.
        </TypographyP>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {SEMANTIC_COLORS.map((color) => (
            <div key={color} className="flex items-center gap-2 rounded-md border p-2">
              <div
                className="h-8 w-8 shrink-0 rounded-md"
                style={{ backgroundColor: `var(--${color}-background)` }}
              />
              <div>
                <TypographySmall className="font-medium capitalize">{color}</TypographySmall>
                <div
                  className="text-[10px] font-mono"
                  style={{ color: `var(--${color}-foreground)` }}
                >
                  foreground
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <TypographyH2 id="ui-tokens">UI Tokens</TypographyH2>
        <TypographyP>
          Core UI tokens that adapt between light and dark themes.
        </TypographyP>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {['background', 'foreground', 'primary', 'secondary', 'muted', 'accent', 'card', 'popover', 'border', 'input', 'ring'].map((token) => (
            <div key={token} className="flex items-center gap-2 rounded-md border p-2">
              <div
                className="h-6 w-6 shrink-0 rounded-md border"
                style={{ backgroundColor: `var(--${token})` }}
              />
              <TypographySmall className="font-mono">{token}</TypographySmall>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
