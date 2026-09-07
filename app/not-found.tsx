import Link from 'next/link';
import { primaryButton } from '@/lib/styles';

export default function NotFound() {
  return (
    <div className="max-w-lg space-y-block py-section">
      <div className="space-y-tight">
        <h1 className="text-3xl">Not here</h1>
        <p className="text-muted">
          That page has moved or sold out. The rest of the collection is still up.
        </p>
      </div>
      <Link href="/store" className={primaryButton}>
        Back to the store
      </Link>
    </div>
  );
}
