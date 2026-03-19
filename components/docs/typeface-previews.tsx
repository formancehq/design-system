'use client';

import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { Eyebrow } from '@/registry/default/ui/eyebrow';
import { Tabs, TabsList, TabsTrigger } from '@/registry/default/ui/tabs';
import {
  TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyH5, TypographyP,
} from '@/registry/default/ui/typography';

export function TypefacePreviews() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6 space-y-3">
        <div className="flex items-baseline justify-between">
          <h4 className="text-lg font-semibold">Polymath</h4>
          <span className="text-sm font-mono text-muted-foreground">--font-sans (primary)</span>
        </div>
        <TypographyH1>Stop Fighting Your Ledger</TypographyH1>
        <TypographyH2>Stop Fighting Your Ledger</TypographyH2>
        <TypographyH3>Stop Fighting Your Ledger</TypographyH3>
        <TypographyH4>Stop Fighting Your Ledger</TypographyH4>
        <TypographyH5>Stop Fighting Your Ledger</TypographyH5>
        <TypographyP>Stop Fighting Your Ledger</TypographyP>
      </div>

      <div className="rounded-lg border p-6 space-y-3">
        <div className="flex items-baseline justify-between">
          <h4 className="text-lg font-semibold">Figtree</h4>
          <span className="text-sm font-mono text-muted-foreground">--font-sans (fallback)</span>
        </div>
        <TypographyH1 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH1>
        <TypographyH2 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH2>
        <TypographyH3 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH3>
        <TypographyH4 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH4>
        <TypographyH5 style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyH5>
        <TypographyP style={{ fontFamily: 'Figtree' }}>Stop Fighting Your Ledger</TypographyP>
      </div>

      <div className="rounded-lg border p-6 space-y-6">
        <div className="flex items-baseline justify-between">
          <h4 className="text-lg font-semibold">Berkeley Mono</h4>
          <span className="text-sm font-mono text-muted-foreground">--font-mono (primary)</span>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Used in interactive elements — always uppercase, always mono.</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Buttons</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="bracketed">Bracketed</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Badges</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">Active</Badge>
                <Badge variant="valid">Valid</Badge>
                <Badge variant="destructive">Failed</Badge>
                <Badge variant="warning">Pending</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Draft</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Eyebrows</p>
              <div className="flex flex-col gap-2">
                <Eyebrow variant="primary">Getting started</Eyebrow>
                <Eyebrow variant="gold">New feature</Eyebrow>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tabs</p>
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

      <div className="rounded-lg border p-6 space-y-3">
        <div className="flex items-baseline justify-between">
          <h4 className="text-lg font-semibold">Space Mono</h4>
          <span className="text-sm font-mono text-muted-foreground">--font-mono (fallback)</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Fallback monospace font when Berkeley Mono is unavailable. Same uppercase treatment applies.
        </p>
      </div>
    </div>
  );
}
