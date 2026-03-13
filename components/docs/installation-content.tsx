import { CodeBlock } from '@/components/code-block';
import { TypographyH2, TypographyP, TypographyList, TypographyListItem, TypographyInlineCode } from '@/registry/default/ui/typography';

const REGISTRY_URL = 'https://design.formance.com';

export async function InstallationContent() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <TypographyH2 id="quick-start">Quick Start</TypographyH2>
        <TypographyP>
          The Formance design system is distributed as a shadcn registry. Install
          components directly into your project using the CLI.
        </TypographyP>
        <CodeBlock
          code={`npx shadcn add ${REGISTRY_URL}/r/button.json`}
          lang="bash"
        />
      </section>

      <section className="space-y-4">
        <TypographyH2 id="registry-url">Registry URL</TypographyH2>
        <TypographyP>
          Point the shadcn CLI at the Formance registry to install any component:
        </TypographyP>
        <CodeBlock code={REGISTRY_URL} lang="bash" />
      </section>

      <section className="space-y-4">
        <TypographyH2 id="install-multiple">Install Multiple Components</TypographyH2>
        <TypographyP>
          Install several components at once:
        </TypographyP>
        <CodeBlock
          code={`npx shadcn add ${REGISTRY_URL}/r/button.json
npx shadcn add ${REGISTRY_URL}/r/card.json
npx shadcn add ${REGISTRY_URL}/r/input.json
npx shadcn add ${REGISTRY_URL}/r/badge.json`}
          lang="bash"
        />
      </section>

      <section className="space-y-4">
        <TypographyH2 id="prerequisites">Prerequisites</TypographyH2>
        <TypographyList>
          <TypographyListItem>Tailwind CSS v4</TypographyListItem>
          <TypographyListItem>React 19+</TypographyListItem>
          <TypographyListItem>TypeScript 5+</TypographyListItem>
          <TypographyListItem>
            A <TypographyInlineCode>components.json</TypographyInlineCode>{' '}
            file configured for the default style
          </TypographyListItem>
        </TypographyList>
      </section>
    </div>
  );
}
