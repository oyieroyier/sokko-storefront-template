import Link from 'next/link';
import { CatalogueGrid } from '@/components/store/CatalogueGrid';
import { SetupNotice } from '@/components/store/SetupNotice';
import { StoreError } from '@/components/store/StoreError';
import { site } from '@/lib/site';
import { loadCatalogue } from '@/lib/sokko';
import { primaryButton } from '@/lib/styles';

// Next requires a literal here. Keep it in step with CATALOGUE_TTL in
// lib/sokko.ts, which caches the Sokko response itself.
export const revalidate = 300;

export default async function HomePage() {
  const catalogue = await loadCatalogue({ limit: 3 });

  return (
    <div className="space-y-section">
      {/*
        No `py-*` here. `main` already carries `py-block` and the wrapper's
        `space-y-section` sets the gap to whatever follows; adding padding on
        top of both is how the hero ends up floating in dead space.
      */}
      <section className="space-y-block">
        <div className="max-w-2xl space-y-tight">
          <h1 className="text-4xl text-balance sm:text-5xl lg:text-6xl">{site.tagline}</h1>
          <p className="text-lg leading-relaxed text-muted">{site.description}</p>
        </div>

        <Link href="/store" className={primaryButton}>
          Shop the collection
        </Link>
      </section>

      {catalogue.status === 'unconfigured' && <SetupNotice />}
      {catalogue.status === 'error' && <StoreError message={catalogue.message} />}

      {catalogue.status === 'ready' && catalogue.products.length > 0 && (
        <section className="space-y-block">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl">Latest</h2>
            <Link href="/store" className="text-sm text-muted transition-brand hover:text-ink">
              See everything
            </Link>
          </div>
          <CatalogueGrid products={catalogue.products} />
        </section>
      )}
    </div>
  );
}
