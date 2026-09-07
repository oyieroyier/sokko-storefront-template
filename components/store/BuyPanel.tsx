'use client';

import { useProductPurchase, type Product } from '@sokkoke/storefront-react';
import { CheckoutCurtain } from '@/components/store/CheckoutCurtain';
import { CheckoutNotice } from '@/components/store/CheckoutNotice';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { VariantPicker } from '@/components/store/VariantPicker';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { cart } from '@/lib/cart';
import { storefront } from '@/lib/sokko';
import { useCheckoutHandoff } from '@/lib/useCheckoutHandoff';
import { primaryButton, secondaryButton } from '@/lib/styles';

/**
 * The purchase machine for one product.
 *
 * `useProductPurchase` owns variant selection, the clamped quantity, the
 * "added" confirmation and buy-now, including the resets that are easy to
 * forget by hand: quantity back to 1 on a product change, "added" cleared
 * when the selection changes. This component only decides how it looks.
 *
 * Nothing here touches money. Buy-now creates a guest cart on Sokko and hands
 * the buyer over; price, delivery and payment are settled on Sokko's side,
 * which is why a stale price in this browser can never become a stale charge.
 */
export function BuyPanel({ product }: { product: Product }) {
  const {
    groups,
    selection,
    select,
    selectedVariant,
    isComplete,
    quantity,
    maxQuantity,
    setQuantity,
    added,
    addToBasket,
    buyNow,
    checkoutError
  } = useProductPurchase(storefront, cart, product);

  const { isLeaving, begin, onCovered } = useCheckoutHandoff();

  const unavailable = isComplete && !selectedVariant;

  return (
    <div className="space-y-block">
      <div className="flex flex-wrap items-center gap-3">
        <Price className="type-display text-2xl" product={product} variant={selectedVariant} />
        {product.installmentEligible && <Badge>Instalments</Badge>}
      </div>

      <VariantPicker groups={groups} selection={selection} onSelect={select} />

      {unavailable && (
        <p className="text-sm text-danger">That combination is sold out. Try another.</p>
      )}

      <QuantityStepper maxQuantity={maxQuantity} onChange={setQuantity} quantity={quantity} />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={primaryButton}
          disabled={!selectedVariant || isLeaving}
          onClick={() => begin(() => buyNow({ navigate: false }))}
        >
          {selectedVariant ? 'Buy now' : 'Select an option'}
        </button>
        {/* Also disabled while leaving. A checkout in flight and a basket
            still taking additions is a buyer editing an order that has
            already been priced. */}
        <button
          type="button"
          className={secondaryButton}
          disabled={!selectedVariant || isLeaving}
          onClick={addToBasket}
        >
          {added ? 'Added' : 'Add to basket'}
        </button>
      </div>

      {/* Confirm the add to a screen reader as well as to the eye. */}
      <span aria-live="polite" className="sr-only">
        {added ? `${product.title} added to basket` : ''}
      </span>

      {checkoutError && <p className="text-sm text-danger">{checkoutError}</p>}

      <CheckoutNotice product={product} />

      <CheckoutCurtain isLeaving={isLeaving} onCovered={onCovered} />
    </div>
  );
}
