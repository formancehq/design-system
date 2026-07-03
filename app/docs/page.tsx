import { redirect } from 'next/navigation';

import { docsConfig } from '@/config/docs';

export default function DocsIndexPage() {
  for (const section of docsConfig.sidebarNav) {
    for (const item of section.items) {
      if (item.href.startsWith('/docs/')) {
        redirect(item.href);
      }
    }
  }

  redirect('/');
}
