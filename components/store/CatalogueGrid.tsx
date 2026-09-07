import type { Product } from '@sokkoke/storefront-react';
import { ProductTile } from '@/components/store/ProductTile';
import { Notice } from '@/components/ui/Notice';

export function CatalogueGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <Notice title="Nothing on sale yet">
        Publish a product in your Sokko dashboard and it shows up here.
      </Notice>
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
