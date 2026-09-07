import { CatalogueGridSkeleton } from '@/components/store/ProductTileSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <div className="space-y-section">
      <section className="space-y-block py-block">
        <div className="max-w-2xl space-y-tight">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="h-11 w-48 rounded-control" />
        <Skeleton className="h-14 w-full rounded-card" />
      </section>
      <CatalogueGridSkeleton count={3} />
    </div>
  );
}
