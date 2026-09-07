/**
 * The README screenshots, rebuilt from the real thing.
 *
 * Wearing a preset is two edits, not one: a class in app/layout.tsx and a
 * display face in app/fonts.ts, because next/font has to see a static import
 * to self-host a typeface. So this cannot shoot four themes from one build the
 * way the live demo bar switches them — it makes both edits, builds, shoots,
 * and moves on. Four production builds, then a montage. Slow and honest.
 *
 * Both files are restored on the way out, including on Ctrl-C. If a run is
 * ever killed hard enough to skip that, `git checkout app/fonts.ts
 * app/layout.tsx` puts them back.
 *
 * Whatever .env.local points at is what appears in these images, and they are
 * committed to a public repo. Point it at a catalogue you own.
 *
 * Usage:
 *   node scripts/shoot-screenshots.mjs
 *   node scripts/shoot-screenshots.mjs --theme=soft --out=/tmp/try
 *   node scripts/shoot-screenshots.mjs --dark --no-montage
 */
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? true];
  })
);

const OUT = resolve(args.out ?? 'docs/screenshots');
const PORT = Number(args.port ?? 3100);
const WIDTH = Number(args.width ?? 1440);
const HEIGHT = Number(args.height ?? 1000);
const ONLY = typeof args.theme === 'string' ? args.theme.toLowerCase() : null;

const FONTS = 'app/fonts.ts';
const LAYOUT = 'app/layout.tsx';

/*
 * lib/themes.ts is the single source of truth for what a preset is, and it is
 * TypeScript, so it is read rather than imported. Parsing beats keeping a
 * second copy of the list here that could drift from the one the site uses.
 */
function readPresets() {
  const source = readFileSync('lib/themes.ts', 'utf8');
  const start = source.indexOf('export const presets');
  const block = source.slice(start, source.indexOf('];', start));
  const pattern = /name:\s*'([^']+)',\s*className:\s*'([^']*)',\s*face:\s*'([^']+)'/g;
  const presets = [...block.matchAll(pattern)].map(([, name, className, face]) => ({
    name,
    className,
    face,
    // 'Plus Jakarta Sans' is exported by next/font/google as Plus_Jakarta_Sans.
    ident: face.replace(/ /g, '_'),
    slug: name.toLowerCase()
  }));
  if (!presets.length)
    throw new Error('No presets parsed from lib/themes.ts — has its shape changed?');
  return presets;
}

const chrome = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'].find(
  (bin) => spawnSync('command', ['-v', bin], { shell: true }).status === 0
);

function preflight() {
  if (!chrome) throw new Error('No Chrome found. Install google-chrome or chromium.');
  if (
    !existsSync('.env.local') ||
    !/NEXT_PUBLIC_SOKKO_STOREFRONT_ID=\S/.test(readFileSync('.env.local', 'utf8'))
  ) {
    throw new Error(
      '.env.local has no NEXT_PUBLIC_SOKKO_STOREFRONT_ID. Screenshots of the setup notice are not screenshots.'
    );
  }
}

/** The two edits that make the site wear a preset. */
function wear({ className, ident }) {
  const fonts = readFileSync(FONTS, 'utf8')
    .replace(
      /^import \{[^}]*\} from 'next\/font\/google';$/m,
      `import { ${ident}, Inter } from 'next/font/google';`
    )
    .replace(/export const displayFont = \w+\(/, `export const displayFont = ${ident}(`);
  writeFileSync(FONTS, fonts);

  const layout = readFileSync(LAYOUT, 'utf8').replace(
    /^const theme = '[^']*';$/m,
    `const theme = '${className}';`
  );
  writeFileSync(LAYOUT, layout);
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, { stdio: 'inherit', ...options });
  if (result.status !== 0) throw new Error(`${command} ${commandArgs.join(' ')} failed`);
}

/*
 * `npx next start` is deliberately avoided: killing the npx wrapper leaves
 * next-server holding the port, and the next theme then quietly screenshots
 * the previous build. Own the process group, kill the process group.
 */
async function serve() {
  const server = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], {
    stdio: 'ignore',
    detached: true
  });
  const stop = () => {
    try {
      process.kill(-server.pid, 'SIGKILL');
    } catch {
      /* Already gone. */
    }
  };
  const deadline = Date.now() + 60_000;
  for (;;) {
    if (Date.now() > deadline) {
      stop();
      throw new Error(`Server did not answer on ${PORT} within 60s`);
    }
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/`);
      if (response.ok) return stop;
    } catch {
      /* Not up yet. */
    }
    await new Promise((done) => setTimeout(done, 400));
  }
}

/*
 * The catalogue is fetched in the browser, so a dead API does not fail the
 * build or the request — it renders StoreError, and the run would quietly
 * produce four handsome screenshots of a broken shop. Chrome renders the page
 * once with JS before anything is captured, and the run stops if what came
 * back is not a store.
 */
function verifyStoreLoaded(url) {
  const profile = join(OUT, '.chrome-probe');
  const probe = spawnSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      `--user-data-dir=${profile}`,
      '--virtual-time-budget=10000',
      '--dump-dom',
      url
    ],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
  );
  rmSync(profile, { recursive: true, force: true });
  const dom = probe.stdout ?? '';

  if (dom.includes('The store did not load')) {
    throw new Error(
      'The storefront returned an error. Check the id in .env.local and that Sokko is reachable.'
    );
  }
  if (dom.includes('NEXT_PUBLIC_SOKKO_STOREFRONT_ID')) {
    throw new Error('The site rendered its setup notice, so no id reached the build.');
  }
  const products = (dom.match(/href="\/store\/[^"]+"/g) ?? []).length;
  if (products < 1)
    throw new Error('No product links in the rendered page. Nothing to photograph.');
  return products;
}

function capture(url, file) {
  const profile = join(OUT, '.chrome-profile');
  run(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      `--user-data-dir=${profile}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      // Fonts and images arrive after first paint; let virtual time run past them.
      '--virtual-time-budget=10000',
      ...(args.dark ? ['--force-dark-mode', '--enable-features=WebContentsForceDark'] : []),
      `--screenshot=${file}`,
      url
    ],
    { stdio: 'ignore' }
  );
  rmSync(profile, { recursive: true, force: true });
}

/*
 * The montage is composited by Chrome rather than an image library, so the
 * script keeps its only dependency the one it already needs to take a picture.
 */
function montage(shots) {
  const page = join(OUT, '.montage.html');
  const cards = shots
    .map(
      ({ name, slug }) =>
        `<figure><img src="${slug}.png" alt="${name}"><figcaption>${name}</figcaption></figure>`
    )
    .join('');
  writeFileSync(
    page,
    `<!doctype html><meta charset="utf-8"><style>
      body { margin: 0; padding: 28px; background: #e8e8e4; font: 500 15px/1.4 system-ui, sans-serif; }
      main { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
      figure { margin: 0; }
      img { display: block; width: 100%; border-radius: 8px; box-shadow: 0 6px 24px -8px rgb(0 0 0 / 0.35); }
      figcaption { padding-top: 10px; color: #45454b; }
    </style><main>${cards}</main>`
  );
  const width = WIDTH + 56 + 24;
  const height = Math.round((HEIGHT / WIDTH) * WIDTH) + 120;
  spawnSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      `--user-data-dir=${join(OUT, '.chrome-profile')}`,
      `--window-size=${width},${height}`,
      '--virtual-time-budget=5000',
      `--screenshot=${join(OUT, 'themes.png')}`,
      `file://${page}`
    ],
    { stdio: 'ignore' }
  );
  rmSync(page, { force: true });
  rmSync(join(OUT, '.chrome-profile'), { recursive: true, force: true });
}

const presets = readPresets().filter((preset) => !ONLY || preset.slug === ONLY);
if (!presets.length) throw new Error(`No preset named "${ONLY}"`);

preflight();
mkdirSync(OUT, { recursive: true });

const originals = { [FONTS]: readFileSync(FONTS, 'utf8'), [LAYOUT]: readFileSync(LAYOUT, 'utf8') };
const restore = () => {
  for (const [path, source] of Object.entries(originals)) writeFileSync(path, source);
};
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    restore();
    process.exit(130);
  });
}

try {
  for (const preset of presets) {
    console.log(
      `\n── ${preset.name} — ${preset.face}${preset.className ? ` (.${preset.className})` : ''}`
    );
    wear(preset);
    run('npm', ['run', 'build']);
    const stop = await serve();
    try {
      const products = verifyStoreLoaded(`http://127.0.0.1:${PORT}/`);
      console.log(`   ${products} product link(s) rendered`);
      capture(`http://127.0.0.1:${PORT}/`, join(OUT, `${preset.slug}.png`));
    } finally {
      stop();
    }
  }
  if (!args['no-montage'] && presets.length > 1) montage(presets);
} finally {
  restore();
}

console.log(`\nWrote ${presets.length} screenshot(s) to ${OUT}`);
