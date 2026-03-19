export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function Step({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium">{children}</p>;
}
