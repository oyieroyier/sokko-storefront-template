import { CatalogueGridSkeleton } from '@/components/store/ProductTileSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Shown while the catalogue is in flight. The point is not decoration: on
 * mobile data the alternative is a white page for a second or more, and a
 * skeleton that matches the real grid means nothing jumps when it lands.
 */
export default function StoreLoading() {
  return (
    <div className="space-y-block">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-11 w-72 rounded-control" />
      </header>
      <CatalogueGridSkeleton />
    </div>
  );
}
