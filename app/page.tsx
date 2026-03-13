import Link from 'next/link';
import { Palette, Type, Paintbrush, Package, Shapes, Download } from 'lucide-react';

import { Badge } from '@/registry/default/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/registry/default/ui/card';
import { TypographyH1, TypographyH2, TypographyP, TypographyLead, TypographyInlineCode, TypographySmall } from '@/registry/default/ui/typography';
import { CodeBlock } from '@/components/code-block';

const REGISTRY_URL = 'https://design.formance.com';

const FEATURES = [
  {
    title: 'Colors',
    description: 'Brand palettes and semantic colors in OKLCh.',
    href: '/docs/colors',
    icon: Palette,
  },
  {
    title: 'Typography',
    description: 'Polymath, Figtree, and Berkeley Mono typefaces.',
    href: '/docs/typography',
    icon: Type,
  },
  {
    title: 'Theming',
    description: 'Light and dark mode via CSS custom properties.',
    href: '/docs/theming',
    icon: Paintbrush,
  },
  {
    title: 'Components',
    description: '25+ components built on Radix UI primitives.',
    href: '/docs/components/button',
    icon: Package,
  },
  {
    title: 'Brand',
    description: 'Formance logo and icon in multiple sizes.',
    href: '/docs/brand/formance-logo',
    icon: Shapes,
  },
  {
    title: 'Installation',
    description: 'Get started with the shadcn CLI.',
    href: '/docs/installation',
    icon: Download,
  },
];

export default function Home() {
  return (
    <div className="px-8 py-10 lg:px-12">
      <header className="mb-12 space-y-4">
        <TypographyH1>Formance Design System</TypographyH1>
        <TypographyLead className="max-w-2xl">
          The open-source component registry for Formance. Install any component
          into your project with the shadcn CLI.
        </TypographyLead>
        <div className="flex gap-3 pt-2">
          <Badge variant="emerald" size="md">Open Source</Badge>
          <Badge variant="cobalt" size="md">Tailwind v4</Badge>
          <Badge variant="lilac" size="md">shadcn Registry</Badge>
        </div>
      </header>

      <section className="mb-12 space-y-4">
        <TypographyH2>Quick Start</TypographyH2>
        <TypographyP>
          Add the Formance registry to your project, then install components:
        </TypographyP>
        <CodeBlock
          code={`npx shadcn add ${REGISTRY_URL}/r/button.json\nnpx shadcn add ${REGISTRY_URL}/r/card.json\nnpx shadcn add ${REGISTRY_URL}/r/input.json`}
          lang="bash"
        />
      </section>

      <section className="space-y-6">
        <TypographyH2>Explore</TypographyH2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
        <TypographySmall className="block text-center text-muted-foreground pt-4">
          Press{' '}
          <TypographyInlineCode>⌘K</TypographyInlineCode>{' '}
          to search
        </TypographySmall>
      </section>
    </div>
  );
}
