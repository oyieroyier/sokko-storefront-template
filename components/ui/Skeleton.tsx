import { cn } from '@/lib/cn';

/**
 * A placeholder block. Skeletons exist so a buyer on mobile data sees the
 * shape of the page immediately instead of a white screen, so they have to
 * match the real geometry: same radius, same ratio, same column count.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton rounded-control', className)} />;
}
