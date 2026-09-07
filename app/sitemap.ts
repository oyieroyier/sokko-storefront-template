import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { loadCatalogue } from '@/lib/sokko';

export const revalidate = 300;

/**
 * Every product, so search engines find the catalogue without crawling for it.
 * A store that ships Product structured data and no sitemap has done half the
 * job.
 *
 * `loadCatalogue` returns a state rather than throwing, so an unconfigured
 * clone still builds: the sitemap is simply the two static routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${site.url}/store`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 }
  ];

  // Raise this alongside the limit on app/store/page.tsx if the catalogue
  // outgrows one page.
  const catalogue = await loadCatalogue({ limit: 200 });
  if (catalogue.status !== 'ready') return routes;

  return [
    ...routes,
    ...catalogue.products.map((product) => ({
      url: `${site.url}/store/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ];
}
