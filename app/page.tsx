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
import { Button } from '@/registry/default/ui/button';
import { PageContainer } from '@/components/ui-fragments/page-container';
import {
  PageSection,
  PageSectionContent,
  PageSectionMeta,
  PageSectionSummary,
  PageSectionTitle,
} from '@/components/ui-fragments/page-section';

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
      <section className="relative isolate overflow-hidden border-b bg-[#01353C] text-emerald-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[length:105%_auto] bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: "url('/welcome-pattern.png')" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[#01353C]/50"
        />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center">
          <h1 className="font-heading text-4xl font-medium leading-tight text-white sm:text-5xl">
            Formance Design System
          </h1>
          <p className="mt-4 text-base text-emerald-200 sm:text-lg">
            The open-source component registry for Formance.
            <br className="hidden sm:inline" /> Install any component into your
            project with the shadcn CLI.
          </p>
          <Button
            asChild
            className="mt-8 bg-[#7E6F4A] text-emerald-100 hover:bg-[#6f6240]"
          >
            <Link href="/docs/installation">Get started</Link>
          </Button>
        </div>
      </section>

      <PageContainer size="large">
        <PageSection>
          <PageSectionMeta>
            <PageSectionSummary>
              <PageSectionTitle className="text-center text-2xl">
                Explore
              </PageSectionTitle>
            </PageSectionSummary>
          </PageSectionMeta>
          <PageSectionContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </PageSectionContent>
        </PageSection>
      </PageContainer>
    </div>
  );
}
