import { Moon, Sun } from 'lucide-react';

import { Button } from '@/registry/default/ui/button';

export type TTheme = 'dark' | 'light' | 'system';

export function ModeToggle({
  theme,
  setTheme,
}: {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}) {
  return (
    <Button
      variant="outline"
      size="icon-md"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="hidden [html.dark_&]:block" />
      <Moon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
