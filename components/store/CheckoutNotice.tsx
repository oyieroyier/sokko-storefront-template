import { checkoutNoticeFor } from '@sokkoke/storefront-react';
import type { Product } from '@sokkoke/storefront-react';

/**
 * Say where the buyer is going before they get there. Checkout runs on
 * Sokko's domain, and an unannounced change of origin reads as a broken link.
 *
 * `checkoutNoticeFor` adds the instalment line when the item is eligible.
 * Pass no product for the basket-wide version.
 */
export function CheckoutNotice({ product }: { product?: Product | null }) {
  return <p className="text-xs leading-relaxed text-muted">{checkoutNoticeFor(product)}</p>;
}
