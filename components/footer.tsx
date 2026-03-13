import { Separator } from '@/registry/default/ui/separator';

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1400px] w-full border-x">
      <Separator />
      <div className="flex items-center justify-between px-6 py-4 text-sm text-muted-foreground">
        <p>
          Built by{' '}
          <a
            href="https://formance.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Formance
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/formancehq"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <span>Powered by shadcn registry</span>
        </div>
      </div>
    </footer>
  );
}
