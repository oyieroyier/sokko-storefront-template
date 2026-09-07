import Link from 'next/link';
import { fromPrice, type Product } from '@sokkoke/storefront-react';
import { cn } from '@/lib/cn';

export const sortOptions = [
  { value: 'newest', label: 'Newest', order: 'newest first' },
  { value: 'price-asc', label: 'Lowest first', order: 'lowest price first' },
  { value: 'price-desc', label: 'Highest first', order: 'highest price first' }
] as const;

/**
 * Below this many products a sort control is noise: the orderings return
 * near-identical grids and the control reads as broken.
 */
export const SORT_MINIMUM = 6;

/** How the store page says the current ordering out loud. */
export function sortSummary(sort: SortValue): string {
  return sortOptions.find((option) => option.value === sort)?.order ?? '';
}

export type SortValue = (typeof sortOptions)[number]['value'];

/** Anything else in the query string, including nothing, means newest. */
export function parseSort(raw: string | string[] | undefined): SortValue {
  return sortOptions.some((option) => option.value === raw) ? (raw as SortValue) : 'newest';
}

/**
 * Price ordering is applied here, over the page the API already returned,
 * rather than by passing a guess to `fetchProducts({ sort })`. Sokko takes
 * `sort` as an opaque string and only `newest` is part of the published
 * contract, so inventing `price_asc` would fail silently on a real store.
 * Raise the catalogue limit before you outgrow one page of results.
 */
export function sortProducts(products: Product[], sort: SortValue): Product[] {
  if (sort === 'newest') return products;

  const direction = sort === 'price-asc' ? 1 : -1;
  return [...products].sort((a, b) => {
    // Products with no price sink to the bottom either way.
    const left = fromPrice(a)?.amount ?? Number.POSITIVE_INFINITY;
    const right = fromPrice(b)?.amount ?? Number.POSITIVE_INFINITY;
    return (left - right) * direction;
  });
}

/**
 * A segmented group of links, not a <select>. The state lives in the URL so
 * it survives a share and the back button, the current choice is visible
 * without opening anything, and the whole control ships zero client JS.
 *
 * The active segment is an outlined plate, not a --brand fill. Ordering rows
 * is not an action, and spending the loudest token in the system on it puts a
 * sort control at the same weight as the checkout button.
 */
export function SortLinks({ active }: { active: SortValue }) {
  return (
    <nav aria-label="Sort products">
      <ul className="flex flex-wrap items-center gap-1 rounded-control border border-line p-1">
        {sortOptions.map((option) => {
          const isActive = option.value === active;
          return (
            <li key={option.value}>
              <Link
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'inline-flex rounded-control px-3 py-1.5 text-sm transition-brand',
                  'border',
                  isActive
                    ? 'border-line-strong bg-surface font-medium text-ink'
                    : 'border-transparent text-muted hover:text-ink'
                )}
                href={option.value === 'newest' ? '/store' : `/store?sort=${option.value}`}
                scroll={false}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
