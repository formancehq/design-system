import { Button } from '@/registry/default/ui/button';
import { FormanceLogo } from '@/registry/default/ui/formance-logo';
import { Separator } from '@/registry/default/ui/separator';

export function Footer() {
  return (
    <footer className="w-full border-x">
      <Separator />
      <div className="flex items-center justify-between px-6 py-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <a
            href="https://formance.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground"
          >
            <FormanceLogo className="min-w-24 max-w-28" />
          </a>
        </div>
        <div className="flex items-center">
          <Button variant="bracketed" size="sm" asChild>
            <a
              href="https://github.com/formancehq/design-system"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
          <Button variant="bracketed" size="sm" asChild>
            <a
              href="https://www.formance.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
