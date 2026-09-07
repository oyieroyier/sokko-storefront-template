/**
 * The typeface. The one brand decision that cannot be a CSS variable, because
 * next/font has to see the import to self-host and preload the files.
 *
 * Two roles, two tokens. `--font-body` is what you read; `--font-title` is
 * what you notice. Using one face for a 48px heading and a 12px caption is
 * the loudest "unfinished template" signal there is.
 *
 * Swap either import and the whole site follows.
 *
 * This is also the second half of wearing a preset. A theme class sets colour
 * and geometry; it cannot reach the typeface, so a preset is two lines, not
 * one — the class in app/layout.tsx, and the display import below:
 *
 *   default (no class)   Inter + Bricolage_Grotesque
 *   theme-neobrutalist   Inter + Space_Grotesk
 *   theme-editorial      Inter + Fraunces
 *   theme-soft           Inter + Plus_Jakarta_Sans
 *
 * All are next/font/google names — change the import and the identifier and
 * nothing else moves. Skipping the font line is survivable, not correct: you
 * get the preset's colour under the default grotesk, which for Editorial in
 * particular is most of the theme missing.
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
