export default function ShimmerColor() {
  return (
    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
      <p className="shimmer shimmer-color-primary/60">Reading the ledger…</p>
      <p className="shimmer shimmer-color-[#378ADD]">Reading the ledger…</p>
    </div>
  );
}
