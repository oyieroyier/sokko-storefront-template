'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The departure to Sokko's checkout, staged.
 *
 * The SDK already owns the work: `buyNow` and `checkout` create the cart,
 * attach the idempotency key, and record their own error. Pass either of them
 * here with `{ navigate: false }`, which is the seam the SDK exposes for
 * exactly this, and it hands back the URL instead of jumping.
 *
 * What this adds is the staging. A bare `location.assign` drops the buyer
 * through a white flash onto another origin, which is what a broken link looks
 * like. So a curtain covers the page first, and two things have to land before
 * the browser leaves: the curtain finishing its wipe, and Sokko returning a
 * URL. They race. On a fast connection the URL wins and the curtain sets the
 * pace; on a slow one the curtain waits, holding its sweep. Neither ordering
 * shows a half-covered page.
 *
 * `isLeaving` is held here rather than read from the SDK's `checkoutStatus`,
 * because with `navigate: false` the SDK correctly returns to `idle` the
 * moment the URL arrives. Driving the curtain off that would retract it on
 * precisely the fast connection it is meant to cover.
 */
export function useCheckoutHandoff() {
  const [isLeaving, setIsLeaving] = useState(false);
  const covered = useRef(false);
  const target = useRef<string | null>(null);

  // Both halves of the race call this. The last one through wins.
  const depart = useCallback(() => {
    if (!covered.current || !target.current) return;
    // A full navigation, not a router push: checkout is a different origin.
    window.location.assign(target.current);
  }, []);

  const onCovered = useCallback(() => {
    covered.current = true;
    depart();
  }, [depart]);

  /**
   * `start` is the SDK call, already bound to its input:
   * `begin(() => buyNow({ navigate: false }))`. It resolves to undefined when
   * Sokko refused, in which case the SDK has set `checkoutError` and the
   * curtain retracts so the buyer can read it. The basket is untouched either
   * way.
   */
  const begin = useCallback(
    async (start: () => Promise<string | undefined>) => {
      covered.current = false;
      target.current = null;
      setIsLeaving(true);

      const url = await start();
      if (!url) {
        setIsLeaving(false);
        return;
      }

      target.current = url;
      depart();
    },
    [depart]
  );

  // Coming back from Sokko with the browser's back button can restore this
  // page from the back/forward cache with its JavaScript state frozen mid
  // handoff, which would leave the buyer looking at a curtain over a store
  // they cannot touch. A restored page is a page that is staying.
  useEffect(() => {
    if (!isLeaving) return;

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      covered.current = false;
      target.current = null;
      setIsLeaving(false);
    };

    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [isLeaving]);

  return { isLeaving, begin, onCovered };
}
