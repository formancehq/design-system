'use client';

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderMeta,
  PageHeaderSummary,
  PageHeaderTitle,
} from '@/components/ui-fragments/page-header';

const sizes = ['small', 'default', 'large', 'full'] as const;

export default function PageHeaderSizes() {
  return (
    <div className="w-full flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="w-full border rounded-lg overflow-hidden">
          <PageHeader size={size} background border>
            <PageHeaderMeta>
              <PageHeaderSummary>
                <PageHeaderEyebrow>Size</PageHeaderEyebrow>
                <PageHeaderTitle>{size}</PageHeaderTitle>
                <PageHeaderDescription>
                  {size === 'full'
                    ? 'Full width container with reduced vertical padding (py-4).'
                    : `${size} container max-width with py-8 vertical padding.`}
                </PageHeaderDescription>
              </PageHeaderSummary>
            </PageHeaderMeta>
          </PageHeader>
        </div>
      ))}
    </div>
  );
}
