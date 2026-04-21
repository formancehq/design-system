const BRAND_PALETTES = [
  {
    name: 'Emerald',
    prefix: 'emerald',
    shades: [
      '50',
      '70',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
    ],
  },
  {
    name: 'Lilac',
    prefix: 'lilac',
    shades: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    name: 'Gold',
    prefix: 'gold',
    shades: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    name: 'Cobalt',
    prefix: 'cobalt',
    shades: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    name: 'Mint',
    prefix: 'mint',
    shades: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
];

function Swatch({ varName, label }: { varName: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="h-10 w-10 rounded-md border"
        style={{ backgroundColor: `var(--${varName})` }}
      />
      <span className="text-[10px] font-mono text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function BrandSwatches() {
  return (
    <div className="space-y-4">
      {BRAND_PALETTES.map((palette) => (
        <div key={palette.name} className="space-y-2">
          <h4 className="text-sm font-semibold">{palette.name}</h4>
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
    </div>
  );
}
