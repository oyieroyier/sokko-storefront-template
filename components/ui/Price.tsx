import {
  formatPrice,
  fromPrice,
  type Product,
  type ProductVariant
} from '@sokkoke/storefront-react';
import { cn } from '@/lib/cn';

/**
 * A product's price, and the one place the "From" rule lives.
 *
 * A product whose variants carry more than one price has no single price
 * until the buyer chooses, so the listing shows the cheapest prefixed with
 * "From". A product priced the same in every size just shows the price.
 * That rule was written out twice, in the tile and in the buy panel, which is
 * how the third copy gets it wrong. Both now call this.
 *
 * Server-safe: `fromPrice` and `formatPrice` are plain functions.
 */
export function Price({
  product,
  variant,
  className
}: {
  product: Product;
  /** The chosen variant, once there is one. Its price replaces the "from". */
  variant?: ProductVariant;
  className?: string;
}) {
  if (variant) {
    return (
      <span className={className}>{formatPrice(variant.priceAmount, variant.currency)}</span>
    );
  }

  const listed = fromPrice(product);
  if (!listed) return null;

  // Distinct prices, not variant count. Ten sizes at one price is one price,
  // and "From KES 2,000" on a product that is KES 2,000 in every size tells
  // the buyer the number might move at checkout when it cannot. Keyed on
  // currency too, so a mixed-currency catalogue does not collapse to one.
  const prices = new Set(
    (product.variants ?? []).map((entry) => `${entry.currency}:${entry.priceAmount}`)
  );
  const hasChoice = prices.size > 1;

  return (
    <span className={className}>
      {hasChoice && <span className={cn('text-muted', 'font-normal')}>From </span>}
      {formatPrice(listed.amount, listed.currency)}
    </span>
  );
}
