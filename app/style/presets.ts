/**
 * Every identity the template ships with, in one list so the picker and the
 * side-by-side panels cannot drift apart.
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
