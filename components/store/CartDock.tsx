'use client';

import type { RefObject } from 'react';
import { formatPrice, useCartDock } from '@sokkoke/storefront-react';
import { CheckoutNotice } from '@/components/store/CheckoutNotice';
import { cart } from '@/lib/cart';
import { storefront } from '@/lib/sokko';
import { primaryButton, quietButton } from '@/lib/styles';

/**
 * The basket trigger and its drawer.
 *
 * `useCartDock` carries the whole modal contract: Escape closes, Tab cycles
 * inside the panel, focus returns to the trigger, the page behind does not
 * scroll, and the drawer closes itself once the basket empties. Keep the
 * trigger and the panel in one component so the focus return has something
 * to return to.
 */
export function CartDock() {
  const { lines, count, subtotal, currency, isOpen, open, close, triggerRef, panelRef, checkout } =
    useCartDock(cart, storefront);

  const working = checkout.status === 'working';

  return (
    <>
      <button
        type="button"
        ref={triggerRef as RefObject<HTMLButtonElement | null>}
        onClick={open}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="rounded-control border border-line px-3 py-1.5 text-sm transition-colors hover:bg-surface"
      >
        Basket{count > 0 ? ` (${count})` : ''}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close basket"
            className="absolute inset-0 bg-ink/40"
            onClick={close}
            tabIndex={-1}
          />

          <aside
            ref={panelRef}
            aria-label="Basket"
            aria-modal="true"
            role="dialog"
            className="relative flex h-full w-full max-w-sm flex-col border-l border-line bg-page"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-base font-semibold">Basket</h2>
              <button type="button" className={quietButton} onClick={close}>
                Close
              </button>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto">
              {lines.map((line) => (
                <li key={line.variantId} className="flex gap-4 px-5 py-4">
                  {line.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-control border border-line object-cover"
                      src={line.image}
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{line.title}</p>
                    {line.options && <p className="text-xs text-muted">{line.options}</p>}

                    <div className="mt-2 flex items-center gap-3">
                      <label className="sr-only" htmlFor={`qty-${line.variantId}`}>
                        Quantity for {line.title}
                      </label>
                      <input
                        id={`qty-${line.variantId}`}
                        className="h-8 w-14 rounded-control border border-line bg-transparent px-2 text-sm"
                        inputMode="numeric"
                        min={1}
                        onChange={(event) =>
                          cart.setQuantity(line.variantId, Number(event.target.value))
                        }
                        type="number"
                        value={line.quantity}
                      />
                      <button
                        type="button"
                        className="text-xs text-muted underline underline-offset-2 hover:text-ink"
                        onClick={() => cart.removeLine(line.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm">
                    {formatPrice((line.priceAmount ?? 0) * line.quantity, line.currency)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-line px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-lg font-semibold">{formatPrice(subtotal, currency)}</span>
              </div>

              {/*
                Display only. Sokko reprices every line at checkout and adds
                delivery there, so this figure is a running total and not a
                quote.
              */}
              <p className="text-xs text-muted">Delivery is added at checkout.</p>

              {checkout.error && <p className="text-sm text-danger">{checkout.error}</p>}

              <button
                type="button"
                className={`${primaryButton} w-full`}
                disabled={working || !lines.length}
                onClick={() =>
                  checkout.checkout(
                    lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity }))
                  )
                }
              >
                {working ? 'Taking you to Sokko' : 'Checkout'}
              </button>

              <CheckoutNotice />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
