'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { checkoutNotice } from '@sokkoke/storefront-react';

/**
 * The curtain itself. `useCheckoutHandoff` owns the race; this only reports
 * when it has finished covering the page.
 *
 * Portalled to the body and above everything, including the basket drawer.
 * By this point the buyer has committed and the page behind is no longer
 * theirs to act on, which is also why the body stops scrolling: a wheel that
 * moves something you cannot see reads as a stuck page. The drawer already
 * locks scroll; a product page does not.
 *
 * This is where the checkout notice finally lands. At the bottom of the buy
 * panel it is read before the decision. Here it is read at the moment the
 * origin changes, which is what it is for.
 */
export function CheckoutCurtain({
  isLeaving,
  onCovered
}: {
  isLeaving: boolean;
  onCovered: () => void;
}) {
  useEffect(() => {
    if (!isLeaving) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // A safety net, not the mechanism. If animationend never arrives, because
    // the tab was backgrounded or the animation was suppressed, the buyer
    // would sit behind a curtain that never lifts, on a payment flow. Well
    // past the wipe, so it never fires first in the normal case.
    const failsafe = window.setTimeout(onCovered, 1500);

    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(failsafe);
    };
  }, [isLeaving, onCovered]);

  if (!isLeaving) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="animate-curtain fixed inset-0 z-[60] flex flex-col items-center justify-center bg-page px-6 text-center"
      onAnimationEnd={(event) => {
        // The content below runs its own animation, which bubbles.
        if (event.target === event.currentTarget) onCovered();
      }}
      role="status"
    >
      <div className="animate-curtain-content">
        <p className="text-xs font-medium tracking-[0.35em] text-muted uppercase">Checkout</p>

        <h2 className="mt-6 text-3xl text-balance sm:text-4xl">Handing you to Sokko</h2>

        <div className="mx-auto mt-10 h-px w-48 overflow-hidden bg-line sm:w-64">
          <div className="animate-sweep h-full w-1/3 bg-brand" />
        </div>

        <p className="mx-auto mt-10 max-w-xs text-xs leading-relaxed text-muted">
          {checkoutNotice}
        </p>
      </div>
    </div>,
    document.body
  );
}
