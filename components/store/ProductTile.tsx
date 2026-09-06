import Link from 'next/link';
import { formatPrice, fromPrice, type Product } from '@sokkoke/storefront-react';
import { storefront } from '@/lib/sokko';

/**
 * A listing tile, rendered on the server.
 *
 * The SDK's `useProductTile` returns exactly this model, but a hook only runs
 * in the browser and a catalogue grid is the part of the site that most needs
 * to be in the HTML. `productImages`, `primaryImageSrcSet` and `fromPrice`
 * are plain functions, so the server can do the same work.
 */
export function ProductTile({ product }: { product: Product }) {
  const [image] = storefront.productImages(product);
  const srcSet = storefront.primaryImageSrcSet(product);
  const price = fromPrice(product);
  const hasChoice = (product.variants?.length ?? 0) > 1;

  return (
    <Link href={`/store/${product.slug}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-card border border-line bg-surface">
        {image ? (
          // A plain img, not next/image: the srcset already comes from Sokko's
          // stored renditions, and this keeps the template deployable anywhere
          // without whitelisting an image host.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
            src={image}
            srcSet={srcSet}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image yet
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium">{product.title}</h3>
        {price && (
          <p className="shrink-0 text-sm text-muted">
            {hasChoice ? 'From ' : ''}
            {formatPrice(price.amount, price.currency)}
          </p>
        )}
      </div>
    </Link>
  );
}
