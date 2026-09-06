import type { Product } from '@sokkoke/storefront-react';
import { ProductTile } from '@/components/store/ProductTile';

export function CatalogueGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="rounded-card border border-line bg-surface p-8">
        <h2 className="text-lg font-semibold">Nothing on sale yet</h2>
        <p className="mt-2 text-sm text-muted">
          Publish a product in your Sokko dashboard and it shows up here.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductTile product={product} />
        </li>
      ))}
    </ul>
  );
}
