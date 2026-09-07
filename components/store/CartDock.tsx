'use client';

import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import { formatPrice, useCartDock } from '@sokkoke/storefront-react';
import { CartLineItem } from '@/components/store/CartLineItem';
import { CheckoutCurtain } from '@/components/store/CheckoutCurtain';
import { CheckoutNotice } from '@/components/store/CheckoutNotice';
import { EmptyBasket } from '@/components/store/EmptyBasket';
import { cart } from '@/lib/cart';
import { storefront } from '@/lib/sokko';
import { primaryButton, quietButton } from '@/lib/styles';
import { useCheckoutHandoff } from '@/lib/useCheckoutHandoff';

/**
 * The basket trigger and its drawer.
 *
 * `useCartDock` carries the whole modal contract: Escape closes, Tab cycles
 * inside the panel, focus returns to the trigger, the page behind does not
 * scroll, and the drawer closes itself once the basket empties. Keep the
 * trigger and the panel in one component so the focus return has something
 * to return to.
 *
 * The overlay is portalled to `document.body` on purpose. This component
 * lives inside the site header, and the header carries `backdrop-blur`. A
 * `backdrop-filter` makes an element the containing block for every
 * `position: fixed` descendant, so without the portal `fixed inset-0`
 * measures the 64px header instead of the viewport: the scrim greys only
 * the header strip and the panel renders 64px tall with its contents
 * spilling down the page. `transform`, `filter` and `perspective` do the
 * same thing. Keep the portal and the drawer survives wherever a client
 * mounts the trigger.
 *
 * Reading `document` during render is safe here because `isOpen` starts
 * false, so the server never reaches this branch.
 */
export function CartDock() {
  const { lines, count, subtotal, currency, isOpen, open, close, triggerRef, panelRef, checkout } =
    useCartDock(cart, storefront);

  const { isLeaving, begin, onCovered } = useCheckoutHandoff();

  return (
    <>
      <button
        type="button"
        ref={triggerRef as RefObject<HTMLButtonElement | null>}
        onClick={open}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={
          count === 0 ? 'Basket' : count === 1 ? 'Basket, 1 item' : `Basket, ${count} items`
        }
        className="inline-flex items-center gap-2 rounded-control border border-line px-3 py-1.5 text-sm transition-brand hover:bg-surface"
      >
        Basket
        {count > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-brand px-1.5 text-xs font-medium text-brand-ink">
            {count}
          </span>
        )}
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex justify-end">
            <button
              type="button"
              aria-label="Close basket"
              className="animate-scrim absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
              onClick={close}
              tabIndex={-1}
            />

            <aside
              ref={panelRef}
              aria-label="Basket"
              aria-modal="true"
              role="dialog"
              className="animate-drawer relative flex h-full w-full max-w-sm flex-col border-l border-line bg-page shadow-raised"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-base">Basket</h2>
                <button type="button" className={quietButton} onClick={close}>
                  Close
                </button>
              </div>

              {lines.length === 0 ? (
                <EmptyBasket onNavigate={close} />
              ) : (
                <>
                  <ul className="flex-1 divide-y divide-line overflow-y-auto">
                    {lines.map((line) => (
                      <CartLineItem key={line.variantId} line={line} onNavigate={close} />
                    ))}
                  </ul>

                  <div className="space-y-tight border-t border-line px-5 py-5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted">Subtotal</span>
                      <span className="type-display text-lg">
                        {formatPrice(subtotal, currency)}
                      </span>
                    </div>

                    {/*
                      Display only. Sokko reprices every line at checkout and
                      adds delivery there, so this figure is a running total
                      and not a quote.
                    */}
                    <p className="text-xs text-muted">Delivery is added at checkout.</p>

                    {checkout.error && <p className="text-sm text-danger">{checkout.error}</p>}

                    <button
                      type="button"
                      className={`${primaryButton} w-full`}
                      disabled={isLeaving}
                      onClick={() =>
                        begin(() =>
                          checkout.checkout(
                            lines.map((line) => ({
                              variantId: line.variantId,
                              quantity: line.quantity
                            })),
                            { navigate: false }
                          )
                        )
                      }
                    >
                      Checkout
                    </button>

                    <CheckoutNotice />
                  </div>
                </>
              )}
            </aside>
          </div>,
          document.body
        )}

      <CheckoutCurtain isLeaving={isLeaving} onCovered={onCovered} />
    </>
  );
}
