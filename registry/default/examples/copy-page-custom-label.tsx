import { CopyPage } from '@/registry/default/fragments/copy-page';

export default function CopyPageCustomLabel() {
  return (
    <CopyPage
      label="Copy article"
      content="# My article\n\nThe full markdown body of the article."
      url="https://example.com/articles/intro"
    />
  );
}
