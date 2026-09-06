import Link from 'next/link';
import { primaryButton } from '@/lib/styles';

export default function NotFound() {
  return (
    <div className="max-w-lg space-y-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Not here</h1>
      <p className="text-muted">
        That page has moved or sold out. The rest of the collection is still up.
      </p>
      <Link href="/store" className={primaryButton}>
        Back to the store
      </Link>
    </div>
  );
}
