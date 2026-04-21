export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-8 py-10 lg:px-12">{children}</div>;
}
