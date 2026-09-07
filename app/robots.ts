import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The style kit is for whoever is building the store, not for search.
      disallow: '/style'
    },
    sitemap: `${site.url}/sitemap.xml`
  };
}
