'use client';

import { ArrowRight } from 'lucide-react';

import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { Eyebrow } from '@/registry/default/ui/eyebrow';
import { Label } from '@/registry/default/ui/label';
import { Separator } from '@/registry/default/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyP,
} from '@/registry/default/ui/typography';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground shrink-0">
        {children}
      </h3>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function PolymathPreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h4 className="text-lg font-semibold">Polymath</h4>
        <span className="text-sm font-mono text-muted-foreground">
          --font-sans
        </span>
      </div>
      <div className="space-y-3">
        <Label className="text-muted-foreground">
          font-heading{' '}
          <code className="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            font-variation-settings: &apos;opsz&apos; 72
          </code>
        </Label>
        <div className="space-y-3">
          <TypographyH1>Stop Fighting Your Ledger</TypographyH1>
          <TypographyH2>Stop Fighting Your Ledger</TypographyH2>
          <TypographyH3>Stop Fighting Your Ledger</TypographyH3>
          <TypographyH4>Stop Fighting Your Ledger</TypographyH4>
          <TypographyH5>Stop Fighting Your Ledger</TypographyH5>
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <Label className="text-muted-foreground">
          font-text{' '}
          <code className="ml-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            font-variation-settings: &apos;opsz&apos; 6
          </code>
        </Label>
        <TypographyP>
          Stop Fighting Your Ledger. Formance Ledger is a programmable financial
          database. Model any financial flow with Numscript and never worry
          about consistency again.
        </TypographyP>
      </div>
    </div>
  );
}

export function BerkeleyMonoPreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h4 className="text-lg font-semibold">Berkeley Mono</h4>
        <span className="text-sm font-mono text-muted-foreground">
          --font-mono
        </span>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Used in interactive elements — always uppercase, always mono.
        </p>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-muted-foreground">Buttons</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="bracketed">Bracketed</Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label className="text-muted-foreground">Badges</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Active</Badge>
              <Badge variant="valid">Valid</Badge>
              <Badge variant="destructive">Failed</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Draft</Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label className="text-muted-foreground">Eyebrows</Label>
            <div className="flex flex-col gap-2">
              <Eyebrow variant="primary">Getting started</Eyebrow>
              <Eyebrow variant="gold">New feature</Eyebrow>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label className="text-muted-foreground">Tabs</Label>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FigtreePreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h4 className="text-lg font-semibold">Figtree</h4>
        <span className="text-sm font-mono text-muted-foreground">
          --font-sans fallback
        </span>
      </div>
      <div className="space-y-3">
        <Label className="text-muted-foreground">font-heading</Label>
        <div className="space-y-3">
          <TypographyH1 style={{ fontFamily: 'Figtree' }}>
            Stop Fighting Your Ledger
          </TypographyH1>
          <TypographyH2 style={{ fontFamily: 'Figtree' }}>
            Stop Fighting Your Ledger
          </TypographyH2>
          <TypographyH3 style={{ fontFamily: 'Figtree' }}>
            Stop Fighting Your Ledger
          </TypographyH3>
          <TypographyH4 style={{ fontFamily: 'Figtree' }}>
            Stop Fighting Your Ledger
          </TypographyH4>
          <TypographyH5 style={{ fontFamily: 'Figtree' }}>
            Stop Fighting Your Ledger
          </TypographyH5>
        </div>
      </div>
      <Separator />
      <div className="space-y-3">
        <Label className="text-muted-foreground">font-text</Label>
        <TypographyP style={{ fontFamily: 'Figtree' }}>
          Stop Fighting Your Ledger. Formance Ledger is a programmable financial
          database. Model any financial flow with Numscript and never worry
          about consistency again.
        </TypographyP>
      </div>
    </div>
  );
}

export function SpaceMonoPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h4 className="text-lg font-semibold">Space Mono</h4>
        <span className="text-sm font-mono text-muted-foreground">
          --font-mono fallback
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Fallback monospace font when Berkeley Mono is unavailable. Same
        uppercase treatment applies.
      </p>
    </div>
  );
}

export function TypographyExampleHero() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border bg-emerald-900 p-10 text-center dark:bg-emerald-950">
      <Eyebrow variant="gold" size="sm">
        _Security
      </Eyebrow>
      <TypographyH1 className="text-white">
        Enterprise-Grade Security
      </TypographyH1>
      <TypographyP className="max-w-md text-emerald-200/80">
        Your core financial infrastructure requires security. We keep your
        infrastructure safe &amp; reliable.
      </TypographyP>
      <Button variant="lilac" size="lg">
        See our Trust Center
        <ArrowRight />
      </Button>
    </div>
  );
}

export function TypographyExampleFeature() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border p-10">
      <Eyebrow variant="primary" size="sm">
        _Ledger
      </Eyebrow>
      <TypographyH2>Stop Fighting Your Ledger</TypographyH2>
      <TypographyP className="max-w-lg">
        Formance Ledger is a programmable financial database. Model any
        financial flow with Numscript and never worry about consistency again.
      </TypographyP>
      <div className="flex gap-3 pt-2">
        <Button variant="primary">Get Started</Button>
        <Button variant="bracketed">
          Read the docs
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export function TypographyExampleCompact() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border p-10 text-center">
      <Badge variant="info">New</Badge>
      <TypographyH3>Reconciliation Engine</TypographyH3>
      <TypographyP className="max-w-sm">
        Automatically match transactions across payment providers, banks, and
        your ledger.
      </TypographyP>
      <Button variant="outline">
        Learn more
        <ArrowRight />
      </Button>
    </div>
  );
}

export function TypefaceSectionLabel({
  variant,
}: {
  variant: 'primary' | 'fallback';
}) {
  return variant === 'primary' ? (
    <div className="space-y-4">
      <SectionLabel>Primary</SectionLabel>
    </div>
  ) : (
    <div className="space-y-4">
      <SectionLabel>Fallback</SectionLabel>
      <p className="text-sm text-muted-foreground">
        Used when the primary fonts are unavailable, like in Google Slide.
        Loaded from Google Fonts.
      </p>
    </div>
  );
}
