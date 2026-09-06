import Link from 'next/link';
import { CatalogueGrid } from '@/components/store/CatalogueGrid';
import { SetupNotice } from '@/components/store/SetupNotice';
import { site } from '@/lib/site';
import { loadCatalogue } from '@/lib/sokko';
import { primaryButton } from '@/lib/styles';

// Rebuild this page at most every five minutes. Raise it for a catalogue that
// rarely changes, lower it if you restock during a drop.
export const revalidate = 300;

export default async function HomePage() {
  const catalogue = await loadCatalogue({ limit: 3 });

  return (
    <div className="space-y-20">
      <section className="max-w-2xl space-y-6 py-8">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {site.tagline}
        </h1>
        <p className="text-lg leading-relaxed text-muted">{site.description}</p>
        <Link href="/store" className={primaryButton}>
          Shop the collection
        </Link>
      </section>

      {catalogue.status === 'unconfigured' && <SetupNotice />}

      {catalogue.status === 'ready' && catalogue.products.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Latest</h2>
            <Link href="/store" className="text-sm text-muted hover:text-ink">
              See everything
            </Link>
          </div>
          <CatalogueGrid products={catalogue.products} />
        </section>
      )}
    </div>
  );
}
