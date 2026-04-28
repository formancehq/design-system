import { Eyebrow } from '@/registry/default/ui/eyebrow';
import { cn } from '@/lib/utils';

type TOklch = readonly [L: number, C: number, h: number];

type TPalette = {
  name: string;
  prefix: string;
  main: string;
  pantone?: string;
  shades: { shade: string; oklch: TOklch }[];
};

const PALETTES: TPalette[] = [
  {
    name: 'Emerald',
    prefix: 'emerald',
    main: '700',
    pantone: '5463 C\n5463 U',
    shades: [
      { shade: '100', oklch: [0.9503, 0.0053, 197.07] },
      { shade: '200', oklch: [0.9225, 0.0096, 196.99] },
      { shade: '300', oklch: [0.9001, 0.0122, 202.07] },
      { shade: '400', oklch: [0.8164, 0.017, 202] },
      { shade: '500', oklch: [0.6433, 0.028, 201.8] },
      { shade: '600', oklch: [0.4754, 0.039, 204.7] },
      { shade: '700', oklch: [0.3026, 0.0516, 208.89] },
      { shade: '800', oklch: [0.253, 0.0427, 208.02] },
      { shade: '900', oklch: [0.1879, 0.032, 202.57] },
    ],
  },
  {
    name: 'Lilac',
    prefix: 'lilac',
    main: '500',
    pantone: '6085 C\n6085 U',
    shades: [
      { shade: '100', oklch: [0.9747, 0.0111, 286.19] },
      { shade: '200', oklch: [0.9457, 0.0274, 288.16] },
      { shade: '300', oklch: [0.9181, 0.0414, 287.08] },
      { shade: '400', oklch: [0.8913, 0.0558, 287.5] },
      { shade: '500', oklch: [0.8635, 0.070365, 286.3527] },
      { shade: '600', oklch: [0.7401, 0.0786, 286.6] },
      { shade: '700', oklch: [0.5996, 0.0915, 284.81] },
      { shade: '800', oklch: [0.467, 0.1001, 284.09] },
      { shade: '900', oklch: [0.3246, 0.1125, 279.57] },
    ],
  },
  {
    name: 'Gold',
    prefix: 'gold',
    main: '500',
    pantone: '4243 C\n4485 U',
    shades: [
      { shade: '100', oklch: [0.9007, 0.0128, 87.49] },
      { shade: '200', oklch: [0.8142, 0.0237, 90.31] },
      { shade: '300', oklch: [0.7306, 0.0333, 87.57] },
      { shade: '400', oklch: [0.6401, 0.0455, 89] },
      { shade: '500', oklch: [0.5448, 0.0561, 88.83] },
      { shade: '600', oklch: [0.4637, 0.046541, 88.8573] },
      { shade: '700', oklch: [0.3909, 0.0391, 88.86] },
      { shade: '800', oklch: [0.2989, 0.0257, 87.46] },
      { shade: '900', oklch: [0.2032, 0.014347, 87.5361] },
    ],
  },
  {
    name: 'Cobalt',
    prefix: 'cobalt',
    main: '500',
    pantone: '2150 C\n6125 U',
    shades: [
      { shade: '100', oklch: [0.922, 0.0198, 238.67] },
      { shade: '200', oklch: [0.9219, 0.0207, 238.68] },
      { shade: '300', oklch: [0.7538, 0.0649, 241.62] },
      { shade: '400', oklch: [0.6744, 0.0881, 242.61] },
      { shade: '500', oklch: [0.5609, 0.102, 244.23] },
      { shade: '600', oklch: [0.5065, 0.0908, 244.14] },
      { shade: '700', oklch: [0.4121, 0.0702, 243.8] },
      { shade: '800', oklch: [0.323, 0.052736, 243.5648] },
      { shade: '900', oklch: [0.2168, 0.0283, 240.87] },
    ],
  },
  {
    name: 'Mint',
    prefix: 'mint',
    main: '500',
    pantone: '2253 C\n2254 U',
    shades: [
      { shade: '100', oklch: [0.9753, 0.0181, 148.38] },
      { shade: '200', oklch: [0.9567, 0.0328, 146.71] },
      { shade: '300', oklch: [0.931, 0.0485, 146.07] },
      { shade: '400', oklch: [0.913, 0.0631, 145.92] },
      { shade: '500', oklch: [0.889, 0.0812, 145.7] },
      { shade: '600', oklch: [0.7756, 0.0752, 146.09] },
      { shade: '700', oklch: [0.6486, 0.0683, 146] },
      { shade: '800', oklch: [0.5265, 0.0674, 145.34] },
      { shade: '900', oklch: [0.3855, 0.061437, 145.0161] },
    ],
  },
];

const ROWS = PALETTES[0].shades.length;

function oklchToRgb([L, C, h]: TOklch): [number, number, number] {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const lc = l_ ** 3;
  const mc = m_ ** 3;
  const sc = s_ ** 3;
  const r = 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const bl = -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc;
  const enc = (v: number) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return [
    Math.round(clamp(enc(r)) * 255),
    Math.round(clamp(enc(g)) * 255),
    Math.round(clamp(enc(bl)) * 255),
  ];
}

function rgbToHex([r, g, b]: [number, number, number]) {
  return (
    '#' +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function rgbToCmyk([r, g, b]: [number, number, number]): [
  number,
  number,
  number,
  number,
] {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const k = 1 - Math.max(rN, gN, bN);
  if (k >= 0.999) return [0, 0, 0, 100];
  return [
    Math.round(((1 - rN - k) / (1 - k)) * 100),
    Math.round(((1 - gN - k) / (1 - k)) * 100),
    Math.round(((1 - bN - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
}

function formatOklch([L, C, h]: TOklch) {
  return `${L} ${C} ${h}`;
}

function isLight([r, g, b]: [number, number, number]) {
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

function ColorCell({
  palette,
  shade,
  oklch,
  heading,
  showCmyk = false,
}: {
  palette: TPalette;
  shade: string;
  oklch: TOklch;
  heading?: string;
  showCmyk?: boolean;
}) {
  const rgb = oklchToRgb(oklch);
  const hex = rgbToHex(rgb);
  const light = isLight(rgb);
  const tone = light ? 'text-emerald-900' : 'text-emerald-50';
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-6 border-l border-border/40 p-5',
        tone
      )}
      style={{ backgroundColor: `var(--${palette.prefix}-${shade})` }}
    >
      <span className="font-mono text-sm uppercase tracking-wider">
        {heading ?? shade}
      </span>
      <dl className="space-y-1 font-mono text-[11px] leading-relaxed opacity-90">
        {palette.pantone && showCmyk ? (
          <Row label="PMS" value={palette.pantone} />
        ) : null}
        <Row label="HEX" value={hex.replace('#', '')} />
        <Row label="RGB" value={`${rgb[0]} ¦ ${rgb[1]} ¦ ${rgb[2]}`} />
        {showCmyk ? (
          <Row label="CMYK" value={rgbToCmyk(rgb).join(' ¦ ')} />
        ) : null}
        <Row label="OKLCH" value={formatOklch(oklch)} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-10 shrink-0 opacity-60">{label}</dt>
      <dd className="whitespace-pre-line">{value}</dd>
    </div>
  );
}

export function BrandSwatches() {
  return (
    <div
      className="not-prose grid overflow-hidden rounded-md border border-border"
      style={{
        gridTemplateColumns: `repeat(${PALETTES.length}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: ROWS }).map((_, rowIdx) =>
        PALETTES.map((p) => {
          const cell = p.shades[rowIdx];
          return (
            <ColorCell
              key={`${p.prefix}-${cell.shade}`}
              palette={p}
              shade={cell.shade}
              oklch={cell.oklch}
            />
          );
        })
      )}
    </div>
  );
}

type TMainEntry = {
  key: string;
  palette: TPalette;
  shade: string;
  oklch: TOklch;
  heading: string;
};

const MAIN_VARIANTS: TMainEntry[] = (() => {
  const entries: TMainEntry[] = [];
  for (const p of PALETTES) {
    const cell = p.shades.find((s) => s.shade === p.main);
    if (!cell) continue;
    entries.push({
      key: `main-${p.prefix}`,
      palette: p,
      shade: cell.shade,
      oklch: cell.oklch,
      heading: `${p.name} · ${cell.shade}`,
    });
  }
  const emerald = PALETTES.find((p) => p.prefix === 'emerald');
  const emerald300 = emerald?.shades.find((s) => s.shade === '300');
  if (emerald && emerald300) {
    entries.push({
      key: 'main-slate',
      palette: { ...emerald, name: 'Slate', pantone: '7541 C\n642 U' },
      shade: emerald300.shade,
      oklch: emerald300.oklch,
      heading: 'Slate',
    });
  }
  return entries;
})();

export function BrandMainVariants() {
  return (
    <div
      className="not-prose grid overflow-hidden rounded-md border border-border"
      style={{
        gridTemplateColumns: `repeat(${MAIN_VARIANTS.length}, minmax(0, 1fr))`,
      }}
    >
      {MAIN_VARIANTS.map((entry) => {
        return (
          <ColorCell
            key={entry.key}
            palette={entry.palette}
            shade={entry.shade}
            oklch={entry.oklch}
            heading={entry.heading}
            showCmyk
          />
        );
      })}
    </div>
  );
}
