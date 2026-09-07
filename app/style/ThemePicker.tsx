'use client';

import { useEffect, useState } from 'react';
import { presetClasses, presets } from '@/app/style/presets';
import { primaryButton, secondaryButton } from '@/lib/styles';

/**
 * Wear a preset for real, on the whole page, instead of reading about it.
 *
 * The class goes on <html>, which is exactly where you would put it in
 * app/layout.tsx to ship it — so the header, the footer and anything
 * portalled follow too, and what you see here is what the store would be.
 *
 * This is a preview control for /style, not a feature. A storefront does not
 * ship a theme switcher: a buyer restyling the shop is not a thing anyone
 * wants, and the class belongs in layout.tsx as one line. Nothing here is
 * wired to storage or the URL for the same reason.
 */
export function ThemePicker() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...presetClasses);
    if (active) root.classList.add(active);
    // Leaving /style must not leave the store wearing a preview theme.
    return () => root.classList.remove(...presetClasses);
  }, [active]);

  return (
    <div className="sticky top-0 z-30 border-b border-line bg-page/90 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-1 text-xs font-medium tracking-wide text-muted uppercase">Theme</p>
        {presets.map((preset) => {
          const isActive = preset.className === active;
          return (
            <button
              aria-pressed={isActive}
              className={isActive ? primaryButton : secondaryButton}
              key={preset.name}
              onClick={() => setActive(preset.className)}
              type="button"
            >
              {preset.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">
        Colour, radius, tile ratio, elevation and rhythm follow. The typeface does not: it is a
        next/font import in <code>app/fonts.ts</code>, so every theme here is drawn in{' '}
        {presets[0].face}. Shipping one is that import plus the class in <code>app/layout.tsx</code>
        .
      </p>
    </div>
  );
}
