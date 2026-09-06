/** Shown when Sokko is reachable but the request failed. */
export function StoreError({ message }: { message: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-8">
      <h2 className="text-lg font-semibold">The store did not load</h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
        Reload the page in a moment. If it keeps failing, the reason was: {message}
      </p>
    </div>
  );
}
