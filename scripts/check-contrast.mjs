/**
 * Every text pair in every theme, in both modes, against WCAG AA.
 *
 * A theme is not a palette, it is a set of promises about legibility, and the
 * one that breaks first is always a colour nobody looks at: an error line on a
 * card, a tinted badge. This reads the token files directly, so a new preset
 * is covered the moment it exists.
 *
 * Usage: npm run check:contrast
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'app/theme.css';
const PRESETS = 'app/themes';

/** `--token: light-dark(#aaa, #bbb);` and plain `--token: #aaa;`. */
function readTokens(path) {
  const css = readFileSync(path, 'utf8');
  const light = {};
  const dark = {};
  const pattern = /--([a-z-]+):\s*(?:light-dark\(\s*(#[0-9a-f]{3,8})\s*,\s*(#[0-9a-f]{3,8})\s*\)|(#[0-9a-f]{3,8}))\s*;/gi;
  for (const [, name, l, d, flat] of css.matchAll(pattern)) {
    light[name] = l ?? flat;
    dark[name] = d ?? flat;
  }
  return { light, dark };
}

const toRgb = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Approximates `bg-success/12` over the page, for the tinted badge. */
const tint = (fg, bg, ratio) => {
  const [f, b] = [toRgb(fg), toRgb(bg)];
  return `#${[0, 1, 2]
    .map((i) => Math.round(f[i] * ratio + b[i] * (1 - ratio)).toString(16).padStart(2, '0'))
    .join('')}`;
};

// Text needs 4.5:1. A focus ring is a UI component boundary and needs 3:1.
// --line is deliberately absent: it draws decorative hairlines, not the
// boundary a control is identified by, and holding it to 3:1 would flatten
// every theme. --line-strong is the one that does carry that job, so it is
// held to 3:1 here.
const PAIRS = [
  ['body text', 'ink', 'page', 4.5],
  ['secondary text', 'muted', 'page', 4.5],
  ['text on a card', 'ink', 'surface', 4.5],
  ['muted on a card', 'muted', 'surface', 4.5],
  ['primary button', 'brand-ink', 'brand', 4.5],
  ['error on a card', 'danger', 'surface', 4.5],
  ['error on the page', 'danger', 'page', 4.5],
  ['success text', 'success', 'page', 4.5],
  // A theme whose brand is acid yellow cannot draw its focus ring in the brand
  // colour, so --focus-ring is an override worth honouring. app/theme.css sets
  // it to var(--brand), which is not a literal this can read, hence the
  // fallback rather than a default.
  ['focus ring', ['focus-ring', 'brand'], 'page', 3],
  ['product frame', 'line-strong', 'page', 3]
];

const themes = [['default', [BASE]]];
if (existsSync(PRESETS)) {
  for (const file of readdirSync(PRESETS).filter((f) => f.endsWith('.css')).sort()) {
    themes.push([file.replace('.css', ''), [BASE, join(PRESETS, file)]]);
  }
}

let failures = 0;

for (const [name, files] of themes) {
  const light = {};
  const dark = {};
  for (const file of files) {
    const tokens = readTokens(file);
    Object.assign(light, tokens.light);
    Object.assign(dark, tokens.dark);
  }

  for (const [mode, tokens] of [['light', light], ['dark', dark]]) {
    const broken = [];

    for (const [label, fg, bg, floor] of PAIRS) {
      const names = Array.isArray(fg) ? fg : [fg];
      const value = names.map((name) => tokens[name]).find(Boolean);
      const ratio = contrast(value, tokens[bg]);
      if (ratio < floor) broken.push(`${label} ${ratio.toFixed(2)} (needs ${floor})`);
    }

    const badge = contrast(tokens.success, tint(tokens.success, tokens.page, 0.12));
    if (badge < 4.5) broken.push(`success badge ${badge.toFixed(2)} (needs 4.5)`);

    failures += broken.length;
    const verdict = broken.length ? `FAIL\n    ${broken.join('\n    ')}` : 'pass';
    console.log(`${name.padEnd(9)} ${mode.padEnd(6)} ${verdict}`);
  }
}

console.log(failures ? `\n${failures} contrast failures.` : '\nAll pairs clear WCAG AA.');
process.exit(failures ? 1 : 0);
