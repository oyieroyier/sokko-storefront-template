'use client';

import Link from 'next/link';
import { primaryButton } from '@/lib/styles';

/**
 * The first thing most buyers see in the drawer. `useCartDock` closes itself
 * when the last line is removed, so this is a first-run state rather than a
 * post-emptying one, and it should point at the collection instead of showing
 * a subtotal of zero next to a dead checkout button.
 */
export function EmptyBasket({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-12 text-center">
      <h3 className="text-base">Your basket is empty</h3>
      <p className="max-w-xs text-sm text-muted">
        Add something from the collection and it shows up here.
      </p>
      <Link className={primaryButton} href="/store" onClick={onNavigate}>
        Browse the store
      </Link>
    </div>
  );
}
