import { CopyPage } from '@/components/ui-fragments/copy-page';

export default function CopyPageCustomMarkdown() {
  return (
    <CopyPage
      content="# Custom markdown\n\nMarkdown body served from a different URL."
      url="https://example.com/docs/guide"
      markdownUrl="https://example.com/raw/guide.md"
    />
  );
}
