'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  applyThemeClass,
  presets,
  readServerThemeClass,
  readThemeClass,
  subscribeToThemeClass,
  themeStorageKey
} from '@/lib/themes';

/**
 * A theme switcher on the real store, for showing a client four looks without
 * four deploys.
 *
 * This is a demo tool, not a storefront feature. A shop does not let buyers
 * restyle it, so nothing here renders unless NEXT_PUBLIC_THEME_DEMO=1, and
 * with the variable unset no script reads or writes storage either. The file
 * is still compiled into the bundle, so when you have settled on a theme, put
 * its class in app/layout.tsx and delete this file outright.
 *
 * The class goes on <html>, which is where it goes to ship it, so the header,
 * the footer and the portalled cart drawer all follow.
 */
export function ThemeDemoBar() {
  // The document is the state; subscribing to it means the buttons always
  // agree with what you are looking at, including what the boot script set.
  const active = useSyncExternalStore(subscribeToThemeClass, readThemeClass, readServerThemeClass);
  const [open, setOpen] = useState(true);

  function choose(className: string) {
    applyThemeClass(className);
    try {
      if (className) localStorage.setItem(themeStorageKey, className);
      else localStorage.removeItem(themeStorageKey);
    } catch {
      // Private mode: the theme still applies, it just will not survive a reload.
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded-card border border-line-strong bg-surface p-3 shadow-raised"
      role="group"
      aria-label="Theme preview"
    >
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Theme preview</p>
        <button
          aria-label="Hide the theme preview"
          className="text-muted transition-brand hover:text-ink"
          onClick={() => setOpen(false)}
          type="button"
        >
          &times;
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => {
          const isActive = preset.className === active;
          return (
            <button
              aria-pressed={isActive}
              className={`rounded-control px-3 py-1.5 text-sm transition-brand ${
                isActive
                  ? 'bg-brand text-brand-ink'
                  : 'border border-line bg-page text-ink hover:bg-surface'
              }`}
              key={preset.name}
              onClick={() => choose(preset.className)}
              type="button"
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      <p className="mt-2 max-w-56 text-xs text-muted">
        Colour and geometry only. The typeface is a next/font import in app/fonts.ts.
      </p>
    </div>
  );
}
