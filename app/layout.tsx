import './globals.css';

import type { Metadata } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import { ThemeProvider } from 'next-themes';
import { Figtree, Space_Mono } from 'next/font/google';

import { CommandMenu } from '@/components/command-menu';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { SideNavigation } from '@/components/side-navigation';
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
  title: 'Design System - Formance',
  description:
    'The open-source design system for Formance. Browse components, copy code, or install via the shadcn registry.',
  manifest: '/favicons/site.webmanifest',
  icons: [
    { rel: 'shortcut icon', url: '/favicons/favicon.ico' },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicons/android-chrome-192x192.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      url: '/favicons/android-chrome-512x512.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicons/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicons/favicon-16x16.png',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-PTCLLFMG" />
      <body
        className={`${figtree.variable} ${spaceMono.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandMenu />
          <Header />
          <div className="flex min-h-[calc(100vh-3rem)] flex-col">
            <main>
              <div className="md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]">
                <aside className="fixed top-12 z-30 hidden h-[calc(100vh-3rem)] w-(--sidebar-width) shrink-0 bg-sidebar md:sticky md:block border-r">
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
