import { Notice } from '@/components/ui/Notice';
import { codeChip, secondaryButton } from '@/lib/styles';

/**
 * What a fresh clone shows until the storefront id is set. It is here so a
 * missing env var reads as one unfinished step, not as a broken store.
 * Delete this component once you are live if you like.
 *
 * The one screen in this template whose reader is a developer, which is why
 * it is allowed to name an environment variable. It is also the reason this
 * is a numbered list and not a paragraph: the reader is here to do three
 * things in order, not to read prose.
 */
const steps = [
  {
    id: 'copy',
    body: (
      <>
        Copy <code className={codeChip}>.env.example</code> to{' '}
        <code className={codeChip}>.env.local</code>.
      </>
    )
  },
  {
    id: 'set',
    body: (
      <>
        Set <code className={codeChip}>NEXT_PUBLIC_SOKKO_STOREFRONT_ID</code> to your id. It is in
        the seller dashboard under Settings, then Developers.
      </>
    )
  },
  { id: 'restart', body: <>Restart the dev server. Env files are read once, at start.</> }
];

export function SetupNotice() {
  return (
    <Notice
      eyebrow="Setup"
      title="Connect your Sokko store"
      className="max-w-xl"
      action={
        <>
          <a className={secondaryButton} href="https://sokko.ke" rel="noreferrer" target="_blank">
            Open Sokko
          </a>
          <span className="text-sm text-muted">Three steps, about a minute.</span>
        </>
      }
    >
      <p>No storefront id is set yet, so there is no catalogue to show.</p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step.id} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border border-line bg-page font-mono text-xs text-ink"
            >
              {index + 1}
            </span>
            <span>{step.body}</span>
          </li>
        ))}
      </ol>
    </Notice>
  );
}
