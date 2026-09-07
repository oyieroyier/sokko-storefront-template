import { createStorefront, type Product } from '@sokkoke/storefront-react';

/**
 * One Sokko client, shared by the server and the browser.
 *
 * The SDK client is plain `fetch`, so server components call it directly and
 * product pages render with their content already in the HTML. The React
 * hooks take this same instance for the interactive parts. Keep it at module
 * scope: the hooks key their effects on the instance, and a client rebuilt
 * per render would refetch forever.
 *
 * No API key. These are Sokko's public, unauthenticated storefront endpoints.
 */
/**
 * How long a catalogue response is reused, in seconds. Lower it during a
 * drop, raise it for a catalogue that rarely changes. The pages export the
 * same number for full-route caching.
 */
export const CATALOGUE_TTL = 300;

export const storefront = createStorefront({
  storefrontId: process.env.NEXT_PUBLIC_SOKKO_STOREFRONT_ID ?? '',
  // `|| undefined` so a blank env var falls back to the production default
  // instead of switching the client off.
  apiUrl: process.env.NEXT_PUBLIC_SOKKO_API_URL || undefined,
  checkoutUrl: process.env.NEXT_PUBLIC_SOKKO_CHECKOUT_URL || undefined,
  tenantId: process.env.NEXT_PUBLIC_SOKKO_TENANT_ID || undefined,
  /*
   * The SDK takes an injectable fetch, which is the hook for Next's data
   * cache. Without it every Sokko call is `no-store`, and the moment a page
   * reads a search param and turns dynamic, that page hits Sokko once per
   * visitor. Caching here rather than on the route means /store keeps its
   * sort links and still serves most requests without a round trip.
   *
   * Reads only. `startCheckout` is a POST that carries an idempotency key,
   * and a cached checkout is the one thing worse than an uncached catalogue.
   * In the browser `next` is an unrecognised init field and is ignored.
   */
  fetch: (input, init) =>
    (init?.method ?? 'GET') === 'GET'
      ? fetch(input, { ...init, next: { revalidate: CATALOGUE_TTL } })
      : fetch(input, init)
});

/** False until NEXT_PUBLIC_SOKKO_STOREFRONT_ID is set. */
export const isStoreConfigured = storefront.isConfigured;

export type CatalogueState =
  | { status: 'unconfigured' }
  | { status: 'ready'; products: Product[] }
  | { status: 'error'; message: string };

export type ProductState =
  | { status: 'unconfigured' }
  | { status: 'ready'; product: Product }
  | { status: 'missing' }
  | { status: 'error'; message: string };

/**
 * Fetch the catalogue for a server component.
 *
 * Every failure is a returned state, never a throw. A store that cannot reach
 * Sokko should show the rest of the site and say so, and `npm run build` has
 * to succeed on a checkout with no `.env` yet.
 */
export async function loadCatalogue(
  options: { limit?: number; sort?: string } = {}
): Promise<CatalogueState> {
  if (!isStoreConfigured) return { status: 'unconfigured' };
  try {
    const { products } = await storefront.fetchProducts(options);
    return { status: 'ready', products };
  } catch (error) {
    return { status: 'error', message: (error as Error).message };
  }
}

/** Fetch one product for a server component. Missing is a state, not an error. */
export async function loadProduct(slug: string): Promise<ProductState> {
  if (!isStoreConfigured) return { status: 'unconfigured' };
  try {
    const product = await storefront.fetchProduct(slug);
    return product ? { status: 'ready', product } : { status: 'missing' };
  } catch (error) {
    const failure = error as Error & { status?: number };
    if (failure.status === 404) return { status: 'missing' };
    return { status: 'error', message: failure.message };
  }
}

/**
 * "More from the store" comes from this catalogue, never from Sokko's
 * marketplace recommender, which would put another seller's product under
 * your masthead.
 */
export async function loadRelated(slug: string, count = 3): Promise<Product[]> {
  if (!isStoreConfigured) return [];
  try {
    // count + 1 so the strip stays full once the current product is dropped.
    const { products } = await storefront.fetchProducts({ limit: count + 1 });
    return products.filter((entry) => entry.slug !== slug).slice(0, count);
  } catch {
    return [];
  }
}
