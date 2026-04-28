export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-layout>{children}</div>;
}
