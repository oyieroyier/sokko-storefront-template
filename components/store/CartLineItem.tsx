'use client';

import Link from 'next/link';
import { formatPrice, type CartLine } from '@sokkoke/storefront-react';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { ProductImage } from '@/components/ui/ProductImage';
import { cart } from '@/lib/cart';

/**
 * One basket line.
 *
 * Quantity uses the same stepper as the product page. Two controls for one
 * job, drawn differently, is the kind of drift that makes a store feel
 * assembled rather than designed.
 *
 * The price shown is a display snapshot taken when the line was added. Sokko
 * reprices every line at checkout, so this is a running total and never a
 * quote.
 */
export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate: () => void }) {
  const title = line.title ?? 'Item';

  return (
    <li className="flex gap-4 px-5 py-4">
      <ProductImage
        alt=""
        className="w-16 shrink-0 rounded-control"
        ratio="square"
        src={line.image}
      />

      <div className="min-w-0 flex-1">
        {line.slug ? (
          <Link
            className="line-clamp-2 text-sm font-medium transition-brand hover:text-muted"
            href={`/store/${line.slug}`}
            onClick={onNavigate}
          >
            {title}
          </Link>
        ) : (
          <p className="line-clamp-2 text-sm font-medium">{title}</p>
        )}
        {line.options && <p className="mt-0.5 text-xs text-muted">{line.options}</p>}

        <div className="mt-2 flex items-center gap-3">
          <QuantityStepper
            label={`Quantity for ${title}`}
            maxQuantity={cart.maxQuantity}
            onChange={(quantity) => cart.setQuantity(line.variantId, quantity)}
            quantity={line.quantity}
            showLabel={false}
            size="sm"
          />
          <button
            type="button"
            className="text-xs text-muted underline underline-offset-2 transition-brand hover:text-ink"
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
  );
}
