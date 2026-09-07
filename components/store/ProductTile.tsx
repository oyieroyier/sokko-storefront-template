import Link from 'next/link';
import type { Product } from '@sokkoke/storefront-react';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { ProductImage } from '@/components/ui/ProductImage';
import { storefront } from '@/lib/sokko';

/**
 * A listing tile, rendered on the server.
 *
 * The SDK's `useProductTile` returns exactly this model, but a hook only runs
 * in the browser and a catalogue grid is the part of the site that most needs
 * to be in the HTML. `productImages`, `primaryImageSrcSet` and `fromPrice`
 * are plain functions, so the server can do the same work.
 *
 * Title above price, both ranged left, rather than the two on one line. A
 * catalogue usually shares a prefix ("Big Rizz Limited Edition ..."), so the
 * word that tells the products apart is the last one, and a single truncated
 * line spends the whole label on the part they have in common.
 */
export function ProductTile({ product }: { product: Product }) {
  const [image] = storefront.productImages(product);
  const srcSet = storefront.primaryImageSrcSet(product);

  return (
    <Link
      href={`/store/${product.slug}`}
      className="group block rounded-card focus-visible:outline-offset-4"
    >
      <div className="relative">
        <ProductImage
          alt={product.title}
          className="transition-brand group-hover:border-muted"
          frame
          // The framed photo is inset from the tile, so this is the tile
          // width less the plate padding. Overstating it costs a rendition.
          imageClassName="transition-brand group-hover:scale-102"
          sizes="(min-width: 1024px) 20rem, (min-width: 640px) 42vw, 86vw"
          src={image}
          srcSet={srcSet}
        />

        {/*
          Instalment eligibility is a reason to buy in this market, so it goes
          where the buyer is deciding rather than in the checkout fine print.
        */}
        {product.installmentEligible && (
          <Badge className="absolute top-5 left-5 shadow-card" tone="brand">
            Instalments
          </Badge>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {/* Two lines, and the height is reserved either way so prices stay on
            one line across the row whether a title wraps or not. */}
        <h3 className="line-clamp-2 min-h-10 text-sm leading-snug font-medium">{product.title}</h3>
        <Price className="block text-sm text-ink" product={product} />
      </div>
    </Link>
  );
}
