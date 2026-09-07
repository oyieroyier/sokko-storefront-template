/**
 * The typeface. The one brand decision that cannot be a CSS variable, because
 * next/font has to see the import to self-host and preload the files.
 *
 * Two roles, two tokens. `--font-body` is what you read; `--font-title` is
 * what you notice. Using one face for a 48px heading and a 12px caption is
 * the loudest "unfinished template" signal there is.
 *
 * Swap either import and the whole site follows. The presets in app/themes
 * were drawn with these pairings:
 *
 *   theme.css (default)  Inter + Bricolage Grotesque
 *   themes/warm.css      Inter + Fraunces
 *   themes/bold.css      Inter + Space Grotesk
 *   themes/mono.css      Inter + Inter
 */
import { Bricolage_Grotesque, Inter } from 'next/font/google';

export const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
});

export const displayFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-title',
  display: 'swap'
});

/** Put this on <html>. Both tokens, one string. */
export const fontVariables = `${bodyFont.variable} ${displayFont.variable}`;
