import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductLoading() {
  return (
    <div className="space-y-block">
      <Skeleton className="h-5 w-48" />

      <div className="grid gap-block lg:grid-cols-2 lg:gap-16">
        <div className="space-y-tight">
          <Skeleton className="aspect-tile w-full rounded-card" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-16 w-16" />
            ))}
          </div>
        </div>

        <div className="space-y-block">
          <div className="space-y-tight">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-11 w-56 rounded-control" />
          <Skeleton className="h-9 w-40 rounded-control" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32 rounded-control" />
            <Skeleton className="h-11 w-36 rounded-control" />
          </div>
        </div>
      </div>
    </div>
  );
}
