'use client'

import { BookOpen, Settings } from 'lucide-react'

import { Button } from '@/registry/default/ui/button'
import {
  PageHeader,
  PageHeaderAside,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderIcon,
  PageHeaderMeta,
  PageHeaderSummary,
  PageHeaderTitle,
} from '@/registry/default/ui/page-header'

export default function PageHeaderDemo() {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <PageHeader size="full" background border>
        <PageHeaderMeta>
          <PageHeaderIcon>
            <BookOpen className="size-10" />
          </PageHeaderIcon>
          <PageHeaderSummary>
            <PageHeaderEyebrow>Module</PageHeaderEyebrow>
            <PageHeaderTitle>Ledger</PageHeaderTitle>
            <PageHeaderDescription>
              Manage ledgers, transactions, and accounts.
            </PageHeaderDescription>
          </PageHeaderSummary>
          <PageHeaderAside>
            <Button variant="primary" size="sm">
              <Settings className="size-4 mr-2" />
              Manage module
            </Button>
          </PageHeaderAside>
        </PageHeaderMeta>
      </PageHeader>
    </div>
  )
}
