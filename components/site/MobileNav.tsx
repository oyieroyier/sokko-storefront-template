'use client';

import { useRef, useState } from 'react';
import { NavLink } from '@/components/site/NavLink';
import { cn } from '@/lib/cn';
import { site } from '@/lib/site';
import { iconButton } from '@/lib/styles';

/**
 * The small-screen disclosure for the main nav.
 *
 * `site.nav` is an array you are meant to extend, and the moment it holds
 * four items the inline header wraps on a 360px phone. So the disclosure
 * ships now rather than after the first client asks for an About page.
 *
 * The panel is always in the DOM and toggled with `hidden`, not mounted and
 * unmounted. `hidden` takes it out of the accessibility tree and the tab
 * order just as well, and it keeps `aria-controls` pointing at an element
 * that actually exists, which is the usual bug in a hand-rolled disclosure.
 *
 * No effects and no document listeners: Escape is handled where focus already
 * is, a click anywhere else lands on the scrim, and every link closes on
 * navigation. Focus returns to the trigger on close, which is the part these
 * menus most often miss.
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      className="sm:hidden"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) close();
      }}
    >
      <button
        type="button"
        ref={triggerRef}
        aria-controls="mobile-nav"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className={iconButton}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
      >
        <span aria-hidden="true" className="relative block h-3 w-4">
          <span
            className={cn(
              'absolute inset-x-0 top-0 h-px bg-current transition-brand',
              isOpen && 'top-1/2 rotate-45'
            )}
          />
          <span
            className={cn(
              'absolute inset-x-0 top-1/2 h-px bg-current transition-brand',
              isOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'absolute inset-x-0 bottom-0 h-px bg-current transition-brand',
              isOpen && 'bottom-1/2 -rotate-45'
            )}
          />
        </span>
      </button>

      {/* Catches a tap anywhere else on the page. Not focusable: Escape and
          the trigger are the keyboard routes out. */}
      {isOpen && (
        <button
          aria-hidden="true"
          className="fixed inset-0 top-16 z-30 cursor-default"
          onClick={close}
          tabIndex={-1}
          type="button"
        />
      )}

      <nav
        aria-label="Main"
        hidden={!isOpen}
        id="mobile-nav"
        className="absolute inset-x-0 top-full z-40 border-b border-line bg-page shadow-card"
      >
        <ul className="container-page flex flex-col py-2">
          {site.nav.map((item) => (
            <li key={item.href}>
              <NavLink
                activeClassName="bg-surface font-medium text-ink"
                className="block rounded-control px-2 py-3 text-base transition-brand"
                href={item.href}
                inactiveClassName="text-ink hover:bg-surface"
                onClick={close}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
