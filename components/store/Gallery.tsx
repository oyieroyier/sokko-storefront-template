'use client';

import { useGallery, type Product } from '@sokkoke/storefront-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { cn } from '@/lib/cn';
import { storefront } from '@/lib/sokko';

/**
 * `useGallery` holds the active image and restarts at the first one whenever
 * the product changes. The first render picks image zero, so the main image
 * is already in the server-rendered HTML.
 */
export function Gallery({ product }: { product: Product }) {
  const { images, activeIndex, activeImage, setActiveIndex } = useGallery(storefront, product);

  return (
    <div className="space-y-tight">
      {/* Framed like the grid tile: the buyer has just clicked one, and the
          photo's own background is no more consistent here than there. */}
      <ProductImage
        alt={product.title}
        frame
        loading="eager"
        sizes="(min-width: 1024px) 32rem, 88vw"
        src={activeImage}
      />

      {images.length > 1 && (
        <ul className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'block h-16 w-16 overflow-hidden rounded-control border transition-brand',
                  index === activeIndex ? 'border-brand' : 'border-line hover:border-muted'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="h-full w-full object-cover" src={image} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
