'use client';

import { useGallery, type Product } from '@sokkoke/storefront-react';
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
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-card border border-line bg-surface">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={product.title}
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 34rem, 92vw"
            src={activeImage}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image yet
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ul className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'h-16 w-16 overflow-hidden rounded-control border transition-colors',
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
