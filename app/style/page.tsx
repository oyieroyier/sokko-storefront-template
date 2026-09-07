import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ControlsPreview } from '@/app/style/ControlsPreview';
import { CatalogueGrid } from '@/components/store/CatalogueGrid';
import { CatalogueGridSkeleton } from '@/components/store/ProductTileSkeleton';
import { SetupNotice } from '@/components/store/SetupNotice';
import { SortLinks } from '@/components/store/SortLinks';
import { StoreError } from '@/components/store/StoreError';
import { Badge } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { ProductImage } from '@/components/ui/ProductImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { iconButton, primaryButton, quietButton, secondaryButton } from '@/lib/styles';

export const metadata: Metadata = {
  title: 'Style kit',
  robots: { index: false, follow: false }
};

/**
 * Every token, control and state on one page.
 *
 * This exists because the alternative way to check a rebrand is to induce a
 * Sokko fetch failure to see what --danger looks like. Nobody does that, so
 * error states are what ship unbranded. Change a value in app/theme.css, load
 * this page, and you have seen the whole store.
 */
function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="space-y-block">
      <div className="space-y-1 border-b border-line pb-3">
        <h2 className="text-xl">{title}</h2>
        {note && <p className="text-sm text-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

const swatches = [
  { token: '--page', className: 'bg-page' },
  { token: '--surface', className: 'bg-surface' },
  { token: '--line', className: 'bg-line' },
  { token: '--muted', className: 'bg-muted' },
  { token: '--ink', className: 'bg-ink' },
  { token: '--brand', className: 'bg-brand' },
  { token: '--danger', className: 'bg-danger' },
  { token: '--success', className: 'bg-success' }
];

/*
 * Every identity the template ships with. `className: ''` is app/theme.css as
 * written; the rest are the classes in app/themes.
 */
const presets = [
  { name: 'Studio', className: '', note: 'default — Bricolage Grotesque' },
  { name: 'Warm', className: 'theme-warm', note: 'theme-warm — Fraunces' },
  { name: 'Bold', className: 'theme-bold', note: 'theme-bold — Space Grotesk' },
  { name: 'Mono', className: 'theme-mono', note: 'theme-mono — Inter' }
];

export default function StyleKitPage() {
  return (
    <div className="space-y-section">
      <header className="max-w-2xl space-y-tight py-block">
        <h1 className="text-4xl text-balance">Style kit</h1>
        <p className="text-lg text-muted">
          Everything the theme controls, on one page, including all four presets side by side.
          Delete this route before you go live if you like.
        </p>
      </header>

      <Section title="Colour" note="Edit these in app/theme.css. Dark mode follows automatically.">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((swatch) => (
            <li key={swatch.token} className="space-y-2">
              <div className={`${swatch.className} h-16 w-full rounded-card border border-line`} />
              <p className="font-mono text-xs text-muted">{swatch.token}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Light and dark"
        note="The same tokens, both modes, side by side. Neither panel is a copy: color-scheme scopes the theme, so what you see here is what the operating system would give a buyer."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {(
            [
              { label: 'Light', className: 'scheme-light' },
              { label: 'Dark', className: 'scheme-dark' }
            ] as const
          ).map((mode) => (
            <div
              key={mode.label}
              className={`${mode.className} space-y-block rounded-card border border-line bg-page p-6 text-ink`}
            >
              <p className="text-xs font-medium tracking-wide text-muted uppercase">{mode.label}</p>

              <ul className="flex gap-2">
                {swatches.map((swatch) => (
                  <li
                    key={swatch.token}
                    className={`${swatch.className} h-10 flex-1 rounded-control border border-line`}
                    title={swatch.token}
                  />
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className={primaryButton}>
                  Buy now
                </button>
                <button type="button" className={secondaryButton}>
                  Add to basket
                </button>
                <Badge tone="brand">Instalments</Badge>
              </div>

              <div className="rounded-card border border-line bg-surface p-4 shadow-card">
                <p className="text-sm">Card on surface, with elevation.</p>
                <p className="mt-1 text-sm text-muted">Muted body copy.</p>
                <p className="mt-1 text-sm text-danger">An error line.</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Presets"
        note="The same components under all four themes. Colour, radius, tile ratio, elevation and rhythm are tokens, so nothing here is a second copy of a component — it is the one component reading different values. The typeface is the exception: it cannot come from CSS, so every panel below is in the face this build imported. Swapping it is the second line in each preset's header."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {presets.map((preset) => (
            <div
              key={preset.name}
              className={`${preset.className} space-y-tight rounded-card border border-line-strong bg-page p-6 text-ink`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="type-display text-lg">{preset.name}</h3>
                <p className="font-mono text-xs text-muted">{preset.note}</p>
              </div>

              <ul className="flex gap-1.5">
                {swatches.map((swatch) => (
                  <li
                    key={swatch.token}
                    className={`${swatch.className} h-8 flex-1 rounded-control border border-line`}
                    title={swatch.token}
                  />
                ))}
              </ul>

              <div className="flex items-start gap-4">
                <div className="w-24 shrink-0">
                  <ProductImage alt="" src={undefined} />
                </div>
                <div className="min-w-0 space-y-2">
                  <p className="type-display text-base">Field jacket</p>
                  <p className="type-display text-sm">KES 3,500</p>
                  <Badge tone="success">In stock</Badge>
                  <p className="text-sm text-muted">
                    Card radius, tile ratio and elevation all move with the theme.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className={primaryButton}>
                  Buy now
                </button>
                <button type="button" className={secondaryButton}>
                  Basket
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Type"
        note="Headings take their face, weight and tracking from the display tokens. Only size is a utility."
      >
        <div className="space-y-tight">
          <h1 className="text-5xl">Heading one</h1>
          <h2 className="text-3xl">Heading two</h2>
          <h3 className="text-xl">Heading three</h3>
          <p className="max-w-prose leading-relaxed">
            Body copy in the reading face. Short, plain, active. A price uses the display setting
            without being a heading: <span className="type-display text-2xl">KES 3,500</span>
          </p>
          <p className="text-sm text-muted">Muted small text, for captions and helper lines.</p>
        </div>
      </Section>

      <Section title="Geometry and elevation" note="Radius, image ratio and shadow tokens.">
        <div className="flex flex-wrap items-end gap-6">
          {[
            { label: 'rounded-card', className: 'rounded-card' },
            { label: 'rounded-control', className: 'rounded-control' },
            { label: 'rounded-pill', className: 'rounded-pill' }
          ].map((shape) => (
            <div key={shape.label} className="space-y-2">
              <div className={`${shape.className} h-20 w-20 border border-line bg-surface`} />
              <p className="font-mono text-xs text-muted">{shape.label}</p>
            </div>
          ))}
          {[
            { label: 'shadow-card', className: 'shadow-card' },
            { label: 'shadow-raised', className: 'shadow-raised' }
          ].map((depth) => (
            <div key={depth.label} className="space-y-2">
              <div
                className={`${depth.className} h-20 w-20 rounded-card border border-line bg-page`}
              />
              <p className="font-mono text-xs text-muted">{depth.label}</p>
            </div>
          ))}
          <div className="space-y-2">
            <div className="aspect-tile w-20 rounded-card border border-line bg-surface" />
            <p className="font-mono text-xs text-muted">aspect-tile</p>
          </div>
        </div>
      </Section>

      <Section title="Controls" note="Hover, focus and disabled are all token driven.">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={primaryButton}>
            Primary
          </button>
          <button type="button" className={primaryButton} disabled>
            Disabled
          </button>
          <button type="button" className={secondaryButton}>
            Secondary
          </button>
          <button type="button" className={quietButton}>
            Quiet
          </button>
          <button type="button" aria-label="Icon button" className={iconButton}>
            +
          </button>
          <Badge>Instalments</Badge>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success">In stock</Badge>
        </div>

        <SortLinks active="newest" />

        <ControlsPreview />
      </Section>

      <Section
        title="Images"
        note="A missing photo and a photo whose URL fails land on the same placeholder."
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <ProductImage alt="" src={undefined} />
          <ProductImage alt="" src="https://example.invalid/missing.jpg" />
          <Skeleton className="aspect-tile w-full rounded-card" />
        </div>
      </Section>

      <Section title="Loading" note="Skeletons match the real grid, so nothing shifts on swap-in.">
        <CatalogueGridSkeleton count={3} />
      </Section>

      <Section
        title="Empty, setup and error states"
        note="The screens buyers hit when something is wrong."
      >
        <div className="space-y-block">
          <CatalogueGrid products={[]} />
          <SetupNotice />
          <StoreError message="TypeError: fetch failed" />
          <Notice
            title="A plain notice"
            action={
              <button type="button" className={secondaryButton}>
                An action
              </button>
            }
          >
            Every notice names what happened and offers the next step.
          </Notice>
        </div>
      </Section>
    </div>
  );
}
