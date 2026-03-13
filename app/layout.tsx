import './globals.css';

import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import { TopNavigation } from '@/components/top-navigation';
import { SideNavigation } from '@/components/side-navigation';
import { CommandMenu } from '@/components/command-menu';
import { Footer } from '@/components/footer';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { SonnerToaster } from '@/registry/default/ui/sonner';

export const metadata: Metadata = {
  title: 'Formance Design System',
  description:
    'The open-source design system for Formance. Browse components, copy code, or install via the shadcn registry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-primary antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandMenu />
          <TopNavigation />
          <main className="mx-auto max-w-[1400px] w-full border-x">
            <div className="md:grid md:grid-cols-[240px_minmax(0,1fr)]">
              <aside className="fixed top-12 z-30 hidden h-[calc(100vh-3rem)] w-[240px] shrink-0 md:sticky md:block border-r">
                <ScrollArea className="h-full">
                  <SideNavigation />
                </ScrollArea>
              </aside>
              <div className="min-h-[calc(100vh-3rem)]">{children}</div>
            </div>
          </main>
          <Footer />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
