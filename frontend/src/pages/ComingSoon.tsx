export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
      <span className="rounded-full bg-accent-dim px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
        Coming Soon
      </span>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="max-w-sm text-sm text-muted">This part of Fathom8x isn’t built in this demo yet.</p>
    </div>
  );
}
