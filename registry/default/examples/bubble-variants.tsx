import { Bubble, BubbleContent } from '@/registry/default/ui/bubble';

const variants = [
  'default',
  'secondary',
  'muted',
  'tinted',
  'outline',
  'ghost',
  'destructive',
] as const;

export default function BubbleVariants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3 py-12">
      {variants.map((variant) => (
        <Bubble key={variant} variant={variant}>
          <BubbleContent>{variant}</BubbleContent>
        </Bubble>
      ))}
    </div>
  );
}
