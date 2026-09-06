'use client';

import { formatPrice, fromPrice, useProductPurchase, type Product } from '@sokkoke/storefront-react';
import { CheckoutNotice } from '@/components/store/CheckoutNotice';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { VariantPicker } from '@/components/store/VariantPicker';
import { cart } from '@/lib/cart';
import { storefront } from '@/lib/sokko';
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
    checkoutStatus,
    checkoutError
  } = useProductPurchase(storefront, cart, product);

  const listed = fromPrice(product);
  const hasChoice = (product.variants?.length ?? 0) > 1;
  const price = selectedVariant
    ? formatPrice(selectedVariant.priceAmount, selectedVariant.currency)
    : listed && `${hasChoice ? 'From ' : ''}${formatPrice(listed.amount, listed.currency)}`;

  const unavailable = isComplete && !selectedVariant;
  const working = checkoutStatus === 'working';

  return (
    <div className="space-y-6">
      {price && <p className="text-2xl font-semibold tracking-tight">{price}</p>}

      <VariantPicker groups={groups} selection={selection} onSelect={select} />

      {unavailable && (
        <p className="text-sm text-danger">That combination is sold out. Try another.</p>
      )}

      <QuantityStepper maxQuantity={maxQuantity} onChange={setQuantity} quantity={quantity} />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={primaryButton}
          disabled={!selectedVariant || working}
          onClick={() => buyNow()}
        >
          {working ? 'Taking you to Sokko' : selectedVariant ? 'Buy now' : 'Select an option'}
        </button>
        <button
          type="button"
          className={secondaryButton}
          disabled={!selectedVariant}
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
    </div>
  );
}
