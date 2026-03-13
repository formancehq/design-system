import { CodeBlock } from '@/components/code-block';
import { REGISTRY_URL } from '@/lib/registry';
import { TypographyH2, TypographyP, TypographyList, TypographyListItem, TypographyInlineCode } from '@/registry/default/ui/typography';

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
        <TypographyH2 id="namespace">Using the @formance Namespace</TypographyH2>
        <TypographyP>
          For a cleaner install experience, add the Formance registry to your{' '}
          <TypographyInlineCode>components.json</TypographyInlineCode>:
        </TypographyP>
        <CodeBlock
          code={`{
  "registries": {
    "@formance": "${REGISTRY_URL}/r/{name}.json"
  }
}`}
          lang="json"
        />
        <TypographyP>
          Then install any component using the namespace:
        </TypographyP>
        <CodeBlock
          code={`npx shadcn@latest add @formance/button
npx shadcn@latest add @formance/card
npx shadcn@latest add @formance/input`}
          lang="bash"
        />
      </section>

      <section className="space-y-4">
        <TypographyH2 id="direct-url">Direct URL</TypographyH2>
        <TypographyP>
          You can also install components directly without configuring the namespace:
        </TypographyP>
        <CodeBlock
          code={`npx shadcn add ${REGISTRY_URL}/r/button.json`}
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
