import Link from 'next/link';
import {
  Palette,
  Type,
  Paintbrush,
  Package,
  Shapes,
  Download,
} from 'lucide-react';

import { AppCard } from '@/components/ui-fragments/app-card';
import { Badge } from '@/registry/default/ui/badge';
import {
  TypographyH2,
  TypographyP,
  TypographyInlineCode,
  TypographySmall,
} from '@/registry/default/ui/typography';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';
import { PageContainer } from '@/components/ui-fragments/page-container';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderSummary,
  PageHeaderTitle,
} from '@/components/ui-fragments/page-header';
import { REGISTRY_URL } from '@/lib/registry';

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
    description: 'Install components with the shadcn CLI.',
    href: '/docs/installation',
    icon: Download,
  },
];

export default function Home() {
  return (
    <div data-slot="docs-page">
      <PageHeader size="large" background border>
        <PageHeaderMeta>
          <PageHeaderSummary>
            <PageHeaderTitle>Formance Design System</PageHeaderTitle>
            <PageHeaderDescription>
              The open-source component registry for Formance. Install any
              component into your project with the shadcn CLI.
            </PageHeaderDescription>
            <div className="flex gap-3 pt-2">
              <Badge variant="emerald" size="md">
                Open Source
              </Badge>
              <Badge variant="cobalt" size="md">
                Tailwind v4
              </Badge>
              <Badge variant="lilac" size="md">
                shadcn Registry
              </Badge>
            </div>
          </PageHeaderSummary>
        </PageHeaderMeta>
      </PageHeader>

      <PageContainer size="large" className="py-8">
        <div className="grid gap-12">
          <section className="space-y-4">
            <TypographyH2>Quick Start</TypographyH2>
            <TypographyP>
              Add the Formance registry to your project, then install
              components:
            </TypographyP>
            <CodeSnippet
              code={`npx shadcn add ${REGISTRY_URL}/r/button.json\nnpx shadcn add ${REGISTRY_URL}/r/card.json\nnpx shadcn add ${REGISTRY_URL}/r/input.json`}
              language="bash"
              size="sm"
              bordered
            />
          </section>

          <section className="space-y-6">
            <TypographyH2>Explore</TypographyH2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <Link key={feature.href} href={feature.href}>
                  <AppCard
                    className="h-full transition-colors hover:bg-muted/50"
                    title={feature.title}
                    description={feature.description}
                    appIcon={feature.icon}
                    iconVariant="outline"
                  />
                </Link>
              ))}
            </div>
            <TypographySmall className="block text-center text-muted-foreground pt-4">
              Press <TypographyInlineCode>⌘K</TypographyInlineCode> to search
            </TypographySmall>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
