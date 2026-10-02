export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 p-6 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
      {label ?? "Loading…"}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="m-4 rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300">
      {message}
    </div>
  );
}
