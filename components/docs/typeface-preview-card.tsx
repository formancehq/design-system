import { CollapsibleCode } from '@/components/collapsible-code';
import { CodeSnippet } from '@/registry/default/ui/code/code-snippet';

const codeSnippets: Record<string, string> = {
  polymath: `import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyP,
} from "@/components/ui/typography"

{/* font-heading — opsz 72, applied automatically on h1–h6 */}
<TypographyH1>Stop Fighting Your Ledger</TypographyH1>
<TypographyH2>Stop Fighting Your Ledger</TypographyH2>
<TypographyH3>Stop Fighting Your Ledger</TypographyH3>
<TypographyH4>Stop Fighting Your Ledger</TypographyH4>
<TypographyH5>Stop Fighting Your Ledger</TypographyH5>

{/* font-text — opsz 6, applied automatically on body */}
<TypographyP>
  Stop Fighting Your Ledger. Formance Ledger is a programmable
  financial database.
</TypographyP>`,

  'berkeley-mono': `import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Button variant="primary">Primary</Button>
<Badge variant="primary">Active</Badge>
<Eyebrow variant="primary">Getting started</Eyebrow>

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="transactions">Transactions</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
</Tabs>`,

  figtree: `{/* Figtree is the fallback for --font-sans (Polymath) */}
{/* Same Typography components — the font swap is automatic */}

<TypographyH1>Stop Fighting Your Ledger</TypographyH1>
<TypographyH2>Stop Fighting Your Ledger</TypographyH2>
<TypographyH3>Stop Fighting Your Ledger</TypographyH3>
<TypographyH4>Stop Fighting Your Ledger</TypographyH4>
<TypographyH5>Stop Fighting Your Ledger</TypographyH5>
<TypographyP>Stop Fighting Your Ledger</TypographyP>`,

  'example-hero': `import { ArrowRight } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Button } from "@/components/ui/button"
import { TypographyH1, TypographyP } from "@/components/ui/typography"

<Eyebrow variant="gold" size="sm">_Security</Eyebrow>
<TypographyH1>Enterprise-Grade Security</TypographyH1>
<TypographyP>
  Your core financial infrastructure requires security.
  We keep your infrastructure safe & reliable.
</TypographyP>
<Button variant="lilac" size="lg">
  See our Trust Center
  <ArrowRight />
</Button>`,

  'example-feature': `import { ArrowRight } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Button } from "@/components/ui/button"
import { TypographyH2, TypographyP } from "@/components/ui/typography"

<Eyebrow variant="primary" size="sm">_Ledger</Eyebrow>
<TypographyH2>Stop Fighting Your Ledger</TypographyH2>
<TypographyP>
  Formance Ledger is a programmable financial database.
  Model any financial flow with Numscript and never
  worry about consistency again.
</TypographyP>
<Button variant="primary">Get Started</Button>
<Button variant="bracketed">
  Read the docs
  <ArrowRight />
</Button>`,

  'example-compact': `import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TypographyH3, TypographyP } from "@/components/ui/typography"

<Badge variant="info">New</Badge>
<TypographyH3>Reconciliation Engine</TypographyH3>
<TypographyP>
  Automatically match transactions across payment
  providers, banks, and your ledger.
</TypographyP>
<Button variant="outline">
  Learn more
  <ArrowRight />
</Button>`,
};

export async function TypefacePreviewCard({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: string;
}) {
  const code = variant ? codeSnippets[variant] : undefined;

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="p-6">{children}</div>
      {code && (
        <CollapsibleCode>
          <CodeSnippet code={code} language="tsx" size="sm" />
        </CollapsibleCode>
      )}
    </div>
  );
}
