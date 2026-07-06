'use client';

import { FileTextIcon, XIcon } from 'lucide-react';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/registry/default/ui/attachment';

const sizes = ['default', 'sm', 'xs'] as const;

export default function AttachmentSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {sizes.map((size) => (
        <Attachment key={size} size={size} className="w-full">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>invoice-{size}.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 96 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove invoice-${size}.pdf`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  );
}
