import Link from 'next/link';
import { MobileNav } from '@/components/site/MobileNav';
import { NavLink } from '@/components/site/NavLink';
import { CartDock } from '@/components/store/CartDock';
import { site } from '@/lib/site';

export function Header() {
  return (
    // A sticky element is a positioned ancestor, which is what the mobile nav
    // panel hangs off. It is also why CartDock portals its drawer out: the
    // backdrop-blur here makes this the containing block for fixed children.
    <header className="sticky top-0 z-40 border-b border-line bg-page/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="type-display text-lg">
          {site.name}
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav aria-label="Main" className="hidden items-center gap-6 sm:flex">
            {site.nav.map((item) => (
              <NavLink key={item.href} href={item.href} className="text-sm transition-brand">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <CartDock />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
