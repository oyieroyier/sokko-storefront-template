import type { Metadata } from 'next';
import { CatalogueGrid } from '@/components/store/CatalogueGrid';
import { SetupNotice } from '@/components/store/SetupNotice';
import {
  SORT_MINIMUM,
  SortLinks,
  parseSort,
  sortProducts,
  sortSummary
} from '@/components/store/SortLinks';
import { StoreError } from '@/components/store/StoreError';
import { loadCatalogue } from '@/lib/sokko';

// Next requires a literal here. Keep it in step with CATALOGUE_TTL in
// lib/sokko.ts, which caches the Sokko response itself.
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Store',
  description: 'Browse the full collection.'
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StorePage({ searchParams }: PageProps) {
  const sort = parseSort((await searchParams).sort);

  // Fetched on the server, so the grid is in the HTML that search engines and
  // share crawlers read. Raise `limit` if you carry more than 48 products, or
  // add paging. `sort: 'newest'` is the only ordering Sokko publishes; the
  // price orderings are applied locally in sortProducts.
  const catalogue = await loadCatalogue({ limit: 48, sort: 'newest' });

  const count = catalogue.status === 'ready' ? catalogue.products.length : 0;
  const canSort = count >= SORT_MINIMUM;

  return (
    <div className="space-y-block">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl">Store</h1>
          {/*
            A count, not a slogan. Payment and delivery are promised in the
            footer on every page, and saying them again here is the same
            sentence twice on one screen. The live region is what tells a
            screen reader that sorting did anything: the grid re-renders in
            place, so without it the change is silent.
          */}
          {catalogue.status === 'ready' && (
            <p aria-live="polite" className="text-muted">
              {count === 1 ? '1 item' : `${count} items`}
              {canSort && `, ${sortSummary(sort)}`}
            </p>
          )}
        </div>
        {canSort && <SortLinks active={sort} />}
      </header>

      {catalogue.status === 'unconfigured' && <SetupNotice />}
      {catalogue.status === 'error' && <StoreError message={catalogue.message} />}
      {catalogue.status === 'ready' && (
        <CatalogueGrid products={sortProducts(catalogue.products, sort)} />
      )}
    </div>
  );
}
