import { TypographyP } from '@/registry/default/ui/typography';

export function AtomsIntroduction() {
  return (
    <div className="space-y-4">
      <TypographyP>
        Atoms are the fundamental building blocks of the Formance design system.
        These are primitive, single-purpose components that serve as the
        foundation for building more complex interfaces. Unlike fragments
        (pre-built composite components) or patterns (guidelines for structuring
        sections), atoms are the smallest reusable units that can be composed
        together.
      </TypographyP>
      <TypographyP>
        These components are based on{' '}
        <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">
          shadcn/ui
        </a>{' '}
        and distributed via the Formance
        registry, making them shareable across all Formance applications. They
        provide consistent styling, accessibility, and behavior for common
        interface elements like buttons, inputs, cards, dialogs, and form
        controls.
      </TypographyP>
      <TypographyP>
        Atoms can be used directly or combined to create fragment components and
        implement UI patterns. They form the base layer of the component
        architecture, ensuring visual and functional consistency across the
        entire design system.
      </TypographyP>
    </div>
  );
}
