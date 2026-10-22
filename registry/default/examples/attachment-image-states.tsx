import { RefreshCwIcon, XIcon } from 'lucide-react';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/registry/default/ui/attachment';

export default function AttachmentImageStates() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex w-full flex-col gap-3">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Horizontal
        </div>
        <div className="flex flex-col gap-2">
          <Attachment state="idle" className="w-full">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
                alt="Office"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>receipt-0912.jpg</AttachmentTitle>
              <AttachmentDescription>Ready to upload</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove receipt-0912.jpg">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="uploading" className="w-full">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
                alt="Workspace"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>statement-scan.png</AttachmentTitle>
              <AttachmentDescription>Uploading · 72%</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove statement-scan.png">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="processing" className="w-full">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"
                alt="Desk"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>invoice-4471.jpg</AttachmentTitle>
              <AttachmentDescription>Reading the amounts</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove invoice-4471.jpg">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="error" className="w-full">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
                alt="Office"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>receipt-0912.jpg</AttachmentTitle>
              <AttachmentDescription>Upload failed</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Retry receipt-0912.jpg">
                <RefreshCwIcon />
              </AttachmentAction>
              <AttachmentAction aria-label="Remove receipt-0912.jpg">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="done" className="w-full">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
                alt="Workspace"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>statement-scan.png</AttachmentTitle>
              <AttachmentDescription>Uploaded · 1.2 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove statement-scan.png">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="px-1 text-xs font-medium text-muted-foreground">
          Vertical
        </div>
        <AttachmentGroup className="w-full">
          <Attachment state="idle" orientation="vertical">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
                alt="Office"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>receipt-0912.jpg</AttachmentTitle>
              <AttachmentDescription>Ready</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove receipt-0912.jpg">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="uploading" orientation="vertical">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
                alt="Workspace"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>statement-scan.png</AttachmentTitle>
              <AttachmentDescription>Uploading</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove statement-scan.png">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="processing" orientation="vertical">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80"
                alt="Desk"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>invoice-4471.jpg</AttachmentTitle>
              <AttachmentDescription>Processing</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove invoice-4471.jpg">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="error" orientation="vertical">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
                alt="Office"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>receipt-0912.jpg</AttachmentTitle>
              <AttachmentDescription>Failed</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Retry receipt-0912.jpg">
                <RefreshCwIcon />
              </AttachmentAction>
              <AttachmentAction aria-label="Remove receipt-0912.jpg">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="done" orientation="vertical">
            <AttachmentMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80"
                alt="Workspace"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>statement-scan.png</AttachmentTitle>
              <AttachmentDescription>Done</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove statement-scan.png">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </AttachmentGroup>
      </div>
    </div>
  );
}
