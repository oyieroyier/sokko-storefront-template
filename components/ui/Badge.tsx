import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const tones = {
  neutral: 'border-line bg-page text-muted',
  brand: 'border-transparent bg-brand text-brand-ink',
  success: 'border-transparent bg-success/12 text-success'
} as const;

/** A short, non-interactive label. Never long enough to wrap. */
export function Badge({
  children,
  tone = 'neutral',
  className
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
