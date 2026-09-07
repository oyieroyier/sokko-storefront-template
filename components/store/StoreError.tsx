'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Notice } from '@/components/ui/Notice';
import { secondaryButton } from '@/lib/styles';

/**
 * Shown when Sokko is reachable but the request failed.
 *
 * The buyer does not see `message`. A raw `SokkoError` string is a developer
 * artefact: "fetch failed" tells a shopper nothing and gives them nothing to
 * do. It goes to the console, and to a details block in development only.
 * What the buyer gets instead is the one thing they can act on, a button.
 *
 * `router.refresh()` re-requests the segment from the server. These pages are
 * revalidated on a timer, so a retry inside that window may return the same
 * cached failure and kick off a regeneration for the next visitor. Lower
 * `revalidate` on the route if you would rather fail fast than serve stale.
 */
export function StoreError({ message }: { message: string }) {
  const router = useRouter();
  const [isRetrying, startRetry] = useTransition();

  return (
    <Notice
      title="The store did not load"
      tone="danger"
      action={
        <button
          type="button"
          className={secondaryButton}
          disabled={isRetrying}
          onClick={() => startRetry(() => router.refresh())}
        >
          {isRetrying ? 'Trying' : 'Try again'}
        </button>
      }
    >
      <p>Something went wrong on our side. Try again in a moment.</p>
      {process.env.NODE_ENV !== 'production' && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs">Details (development only)</summary>
          <p className="mt-1 font-mono text-xs break-words">{message}</p>
        </details>
      )}
    </Notice>
  );
}
