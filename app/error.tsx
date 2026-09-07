'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Notice } from '@/components/ui/Notice';
import { primaryButton, secondaryButton } from '@/lib/styles';

/**
 * The last line of defence: anything that throws while rendering a route
 * lands here instead of on Next's unbranded error page.
 *
 * `digest` and the message stay out of the buyer's view. They identify a bug
 * to whoever is reading the logs, and there is nothing a shopper can do with
 * either. What a shopper gets is two ways forward.
 *
 * Next 16 names the recovery prop `retry`, not `reset`.
 */
export default function RouteError({
  error,
  retry
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  // Where a real store sends this. `digest` is the id that ties a browser
  // report to the matching server log line.
  useEffect(() => {
    console.error('Route render failed:', error);
  }, [error]);

  return (
    <div className="py-section">
      <Notice
        title="Something went wrong"
        tone="danger"
        action={
          <>
            <button type="button" className={primaryButton} onClick={retry}>
              Try again
            </button>
            <Link className={secondaryButton} href="/store">
              Back to the store
            </Link>
          </>
        }
      >
        <p>The page could not be shown. Try again, or go back to the store.</p>
      </Notice>
    </div>
  );
}
