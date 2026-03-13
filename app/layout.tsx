import './globals.css';

import type { Metadata } from 'next';
import { Figtree, Space_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { TopNavigation } from '@/components/top-navigation';
import { SideNavigation } from '@/components/side-navigation';
import { CommandMenu } from '@/components/command-menu';
import { Footer } from '@/components/footer';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { SonnerToaster } from '@/registry/default/ui/sonner';

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

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
      <body className={`${figtree.variable} ${spaceMono.variable} min-h-screen font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandMenu />
          <TopNavigation />
          <div className="flex min-h-[calc(100vh-3rem)] flex-col">
            <main className="mx-auto max-w-[1400px] w-full border-x flex-1">
              <div className="md:grid md:grid-cols-[240px_minmax(0,1fr)]">
                <aside className="fixed top-12 z-30 hidden h-[calc(100vh-3rem)] w-[240px] shrink-0 md:sticky md:block border-r">
                  <ScrollArea className="h-full">
                    <SideNavigation />
                  </ScrollArea>
                </aside>
                <div>{children}</div>
              </div>
            </main>
            <Footer />
          </div>
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
