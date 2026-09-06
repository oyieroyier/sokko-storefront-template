/**
 * What a fresh clone shows until the storefront id is set. It is here so a
 * missing env var reads as one unfinished step, not as a broken store.
 * Delete this component once you are live if you like.
 */
export function SetupNotice() {
  return (
    <div className="rounded-card border border-line bg-surface p-8">
      <h2 className="text-lg font-semibold">Connect your Sokko store</h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
        Copy <code className="font-mono text-ink">.env.example</code> to{' '}
        <code className="font-mono text-ink">.env.local</code> and set{' '}
        <code className="font-mono text-ink">NEXT_PUBLIC_SOKKO_STOREFRONT_ID</code>. Your id is in
        the Sokko seller dashboard under Settings, then Developers. Restart the dev server after
        you save it.
      </p>
    </div>
  );
}
