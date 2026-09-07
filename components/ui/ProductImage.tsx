'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * A product photo in a box that is already the right size.
 *
 * Three jobs a bare <img> gets wrong:
 *
 * 1. The box is reserved from the theme's --tile-aspect, so a grid does not
 *    reflow as photos land on a slow connection.
 * 2. A URL that 404s falls back to the same placeholder as a product with no
 *    photo at all. Sokko media paths are rebased onto your domain, so a
 *    misconfigured media base fails on every tile at once, and the browser's
 *    answer to that is a broken-image glyph inside a card.
 * 3. `frame` insets the photo and gives it a --line-strong edge. A seller's
 *    photos arrive with their own backgrounds baked in, and a catalogue of
 *    black, white and grey backgrounds bled to the card edge is three
 *    different cards: on a dark page the black one has no perceivable extent
 *    at all. Framed, every tile has the same edge whatever was uploaded.
 *    Full-bleed stays the default for thumbnails, where a frame is noise.
 *
 * There is deliberately no fade-in. Gating opacity on an onLoad handler means
 * a visitor with no JavaScript sees a page of empty boxes, and the box below
 * already prevents the layout shift a fade would be covering up.
 *
 * This is a client component so it can hear onError, but it is rendered from
 * server components: the <img> with its real src and srcset is in the server
 * HTML, so crawlers and share cards still see the photo. With JavaScript off
 * it degrades to exactly a plain <img>.
 */
export function ProductImage({
  src,
  srcSet,
  sizes,
  alt,
  ratio = 'tile',
  loading = 'lazy',
  frame = false,
  className,
  imageClassName
}: {
  src: string | undefined;
  srcSet?: string;
  sizes?: string;
  /** Empty string for a photo that adds nothing to the text beside it. */
  alt: string;
  /** `tile` follows the theme's aspect token. `square` is fixed, for thumbs. */
  ratio?: 'tile' | 'square';
  loading?: 'lazy' | 'eager';
  /** Inset the photo on a plate and give it its own edge. */
  frame?: boolean;
  className?: string;
  /** Goes on the <img>, for a hover that has to reach past the frame. */
  imageClassName?: string;
}) {
  // Which URL failed, not whether one did. The gallery swaps `src` on a
  // mounted node, so a boolean would leave the placeholder up for every
  // later photo once any one of them 404s. Comparing against the current
  // src resets the failure for free when the src changes, with no effect.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasFailed = Boolean(src) && failedSrc === src;

  // A cached photo can finish failing before React attaches onError, so read
  // the outcome when the node attaches. `complete` with no intrinsic width is
  // the browser saying it tried and got nothing. Keying the callback on `src`
  // makes React reattach it on a swap, so the check runs per photo.
  const onAttach = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth === 0) setFailedSrc(src ?? null);
    },
    [src]
  );

  const content =
    !src || hasFailed ? (
      <span className="absolute inset-0 flex items-center justify-center text-sm text-muted">
        No image yet
      </span>
    ) : (
      // A plain img, not next/image: the srcset already comes from Sokko's
      // stored renditions, and this keeps the template deployable anywhere
      // without whitelisting an image host.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={onAttach}
        alt={alt}
        className={cn('h-full w-full object-cover', imageClassName)}
        loading={loading}
        onError={() => setFailedSrc(src ?? null)}
        sizes={sizes}
        src={src}
        srcSet={srcSet}
      />
    );

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card border border-line bg-surface',
        ratio === 'tile' ? 'aspect-tile' : 'aspect-square',
        frame && 'p-3 sm:p-4',
        className
      )}
    >
      {frame ? (
        /* rounded-card, not rounded-control: this is a frame around a photo, not
           a control. A theme that makes buttons pills (app/themes/bold.css sets
           --radius-control-size to 9999px) would otherwise crop every product
           image to a circle. */
        <div className="border-line-strong relative h-full w-full overflow-hidden rounded-card border">
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
}
