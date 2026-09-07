import { Skeleton } from '@/components/ui/Skeleton';

/** Matches ProductTile's geometry exactly, so nothing shifts on swap-in. */
export function ProductTileSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-tile w-full rounded-card" />
      <div className="mt-3 space-y-1">
        {/* The tile reserves two title lines whether or not it uses them. */}
        <div className="min-h-10 space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

/** The grid a store page shows before the catalogue arrives. */
export function CatalogueGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductTileSkeleton key={index} />
      ))}
      <span className="sr-only">Loading the collection</span>
    </div>
  );
}
