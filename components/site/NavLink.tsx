'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

/**
 * A main-nav link that knows whether it is the page you are on.
 *
 * Wayfinding, and the reason this is a client component: the header lives in
 * the root layout, so it cannot read the route any other way. `SortLinks`
 * already marks its current choice with `aria-current`; a nav that does not
 * is the inconsistency, not the exception.
 *
 * A product page marks Store as current too. `/store/big-rizz-tee` is inside
 * the store, and a buyer who is three clicks deep still wants to know which
 * part of the site they are in.
 */
export function NavLink({
  href,
  children,
  className,
  activeClassName = 'text-ink',
  inactiveClassName = 'text-muted hover:text-ink',
  onClick
}: {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isCurrent =
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(className, isCurrent ? activeClassName : inactiveClassName)}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
