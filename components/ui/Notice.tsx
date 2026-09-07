import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { surfaceCard } from '@/lib/styles';

/**
 * The shell every empty, setup and error state shares, so they cannot drift
 * apart. A notice always names what happened and offers the next action;
 * `action` is not optional by accident.
 *
 * `eyebrow` is for the one thing the title cannot say without getting long:
 * which kind of state this is. Keep it to a word.
 */
export function Notice({
  title,
  eyebrow,
  children,
  action,
  tone = 'neutral',
  className
}: {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
  action?: ReactNode;
  tone?: 'neutral' | 'danger';
  className?: string;
}) {
  return (
    <div className={cn(surfaceCard, 'p-6 sm:p-8', className)}>
      {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
      <h2 className={cn('text-lg', tone === 'danger' && 'text-danger')}>{title}</h2>
      {children && (
        <div className="mt-2 max-w-prose text-sm leading-relaxed text-muted">{children}</div>
      )}
      {action && <div className="mt-6 flex flex-wrap items-center gap-3">{action}</div>}
    </div>
  );
}
