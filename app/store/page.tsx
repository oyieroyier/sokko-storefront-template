import type { Metadata } from 'next';
import { CatalogueGrid } from '@/components/store/CatalogueGrid';
import { SetupNotice } from '@/components/store/SetupNotice';
import { StoreError } from '@/components/store/StoreError';
import { loadCatalogue } from '@/lib/sokko';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Store',
  description: 'Browse the full collection.'
};

export default async function StorePage() {
  // Fetched on the server, so the grid is in the HTML that search engines and
  // share crawlers read. Raise `limit` if you carry more than 48 products, or
  // add paging.
  const catalogue = await loadCatalogue({ limit: 48, sort: 'newest' });

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Store</h1>
        <p className="text-muted">Pay by M-Pesa. Delivered across Kenya.</p>
      </header>

      {catalogue.status === 'unconfigured' && <SetupNotice />}
      {catalogue.status === 'error' && <StoreError message={catalogue.message} />}
      {catalogue.status === 'ready' && <CatalogueGrid products={catalogue.products} />}
    </div>
  );
}
