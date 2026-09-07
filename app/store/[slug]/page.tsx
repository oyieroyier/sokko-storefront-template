import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fromPrice } from '@sokkoke/storefront-react';
import { BuyPanel } from '@/components/store/BuyPanel';
import { CatalogueGrid } from '@/components/store/CatalogueGrid';
import { Gallery } from '@/components/store/Gallery';
import { SetupNotice } from '@/components/store/SetupNotice';
import { StoreError } from '@/components/store/StoreError';
import { site } from '@/lib/site';
import { loadProduct, loadRelated, storefront } from '@/lib/sokko';

// Next requires a literal here. Keep it in step with CATALOGUE_TTL in
// lib/sokko.ts, which caches the Sokko response itself.
export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Share cards and search results come from here. The product is fetched on
 * the server, so WhatsApp and Google get the real title and image rather than
 * a loading state.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = await loadProduct(slug);
  if (state.status !== 'ready') return { title: 'Product' };

  const { product } = state;
  const [image] = storefront.productImages(product);

  return {
    title: product.title,
    description: product.description ?? site.description,
    alternates: { canonical: `/store/${product.slug}` },
    openGraph: {
      type: 'website',
      title: product.title,
      description: product.description ?? site.description,
      url: `${site.url}/store/${product.slug}`,
      images: image ? [image] : undefined
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const state = await loadProduct(slug);

  if (state.status === 'unconfigured') return <SetupNotice />;
  if (state.status === 'missing') notFound();
  if (state.status === 'error') return <StoreError message={state.message} />;

  const { product } = state;
  const related = await loadRelated(slug);
  const price = fromPrice(product);
  const [image] = storefront.productImages(product);
  const url = `${site.url}/store/${product.slug}`;

  return (
    <div className="space-y-section">
      {/* The breadcrumb belongs to the product, so it sits a block above it
          and not a whole section away. */}
      <div className="space-y-block">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/store" className="transition-brand hover:text-ink">
            Store
          </Link>
          <span aria-hidden="true" className="px-2">
            /
          </span>
          <span className="text-ink">{product.title}</span>
        </nav>

        <div className="grid gap-block lg:grid-cols-2 lg:gap-16">
          <Gallery product={product} />

          <div className="space-y-block">
            {/* Title and description render on the server: they are the page. */}
            <div className="space-y-tight">
              <h1 className="text-3xl text-balance">{product.title}</h1>
              {product.description && (
                <p className="leading-relaxed whitespace-pre-line text-muted">
                  {product.description}
                </p>
              )}
            </div>

            <BuyPanel product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-block">
          {/*
            Drawn from this store's own catalogue. Sokko's recommender covers
            the whole marketplace, which on your domain could put another
            seller's product under your masthead.
          */}
          <h2 className="text-xl">More from the store</h2>
          <CatalogueGrid products={related} />
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.title,
              description: product.description,
              image: image ? [image] : undefined,
              offers: price
                ? {
                    '@type': 'Offer',
                    // ADR-0005: KES amounts are whole shillings. Do not divide.
                    price: price.amount,
                    priceCurrency: price.currency,
                    url
                  }
                : undefined
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: site.name, item: site.url },
                { '@type': 'ListItem', position: 2, name: 'Store', item: `${site.url}/store` },
                { '@type': 'ListItem', position: 3, name: product.title, item: url }
              ]
            }
          ])
        }}
      />
    </div>
  );
}
