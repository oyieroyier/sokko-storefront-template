/**
 * Every identity the template ships with, in one list so the style kit, the
 * demo bar and the docs cannot drift apart.
 *
 * `className: ''` is app/theme.css as written. The rest are the classes in
 * app/themes. `face` is the display font each preset was drawn with, which
 * lives in app/fonts.ts because CSS cannot set a typeface.
 */
export type Preset = {
  name: string;
  className: string;
  face: string;
  note: string;
};

export const presets: Preset[] = [
  {
    name: 'Studio',
    className: '',
    face: 'Bricolage Grotesque',
    note: 'restrained, warm-neutral, monochrome brand'
  },
  {
    name: 'Warm',
    className: 'theme-warm',
    face: 'Fraunces',
    note: 'cream paper, clay brand, tall tiles, round'
  },
  {
    name: 'Bold',
    className: 'theme-bold',
    face: 'Space Grotesk',
    note: 'electric brand, pill controls, heavy display'
  },
  {
    name: 'Mono',
    className: 'theme-mono',
    face: 'Inter',
    note: 'editorial, square corners, no elevation'
  }
];

/** Every preset class, for clearing before applying one. */
export const presetClasses = presets.map((preset) => preset.className).filter(Boolean);

/**
 * Where the demo bar remembers your choice, so it survives a reload and a
 * walk through the store. Nothing else reads it, and a store built without
 * NEXT_PUBLIC_THEME_DEMO never writes it.
 */
export const themeStorageKey = 'sokko-demo-theme';

/**
 * Applies the remembered theme before the first paint.
 *
 * A `useEffect` cannot do this job: it runs after paint, so every hard load
 * would flash the default theme before switching. This runs synchronously, and
 * it only ever writes a class from the list above, so a tampered localStorage
 * value cannot put an arbitrary class on the document.
 */
export const themeBootScript = `
(function () {
  try {
    var allowed = ${JSON.stringify(presetClasses)};
    var stored = localStorage.getItem(${JSON.stringify(themeStorageKey)});
    if (allowed.indexOf(stored) !== -1) document.documentElement.classList.add(stored);
  } catch (error) {
    /* Private mode, storage disabled: the default theme is a fine answer. */
  }
})();
`;

/*
 * The class on <html> is the single source of truth for which theme is worn.
 * Both switchers — the style kit's picker and the demo bar — read and write it
 * through these, so neither has private state that could disagree with the
 * document, and neither clobbers a theme the other one set.
 *
 * They touch `document`, so only call them from a client component.
 */

/** Wear `className`, or the default theme when it is empty. */
export function applyThemeClass(className: string) {
  const root = document.documentElement;
  root.classList.remove(...presetClasses);
  if (className) root.classList.add(className);
}

/** Which preset is on the document right now. Empty means the default. */
export function readThemeClass() {
  return presetClasses.find((name) => document.documentElement.classList.contains(name)) ?? '';
}

/** For useSyncExternalStore: fires whenever anything changes the class. */
export function subscribeToThemeClass(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

/** No document on the server, and the boot script has not run yet either. */
export function readServerThemeClass() {
  return '';
}
