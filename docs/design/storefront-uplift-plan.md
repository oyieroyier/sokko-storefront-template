# Storefront template uplift — design & implementation plan

Status: approved (all four bundles). Author: design-engineering review, 2026-09-06.

## 1. The job

A developer or agency clones this repo to ship a Kenyan merch store on a client's
domain in an afternoon. They should be able to rebrand it by editing one theme
file, verify the rebrand on one page, and go live without hand-writing the
boilerplate every commerce site needs.

Today they can change eight colours. Everything else that makes a brand — type,
geometry, elevation, motion, density, image ratio — is hardcoded across thirteen
components, and the states buyers actually hit (slow connection, failed image,
empty basket, thrown render) are not built.

## 2. Paradigm decision

**The template's product is a design system, not a demo store.** The SDK is
headless and opinionated about behaviour; its counterpart is a template that is
opinionated about design and headless about content. That inverts three things:

- **Tokens over classes.** Every brand-carrying decision moves out of `.tsx`
  into `app/theme.css`. Components consume utilities that resolve to tokens.
- **Presets over prose.** `README` currently *tells* you the theme is
  replaceable. Three complete preset themes *show* the range in one import swap.
  Show-don't-tell applies to the developer as much as the buyer.
- **A kit page over a scavenger hunt.** `/style` renders every token, control
  state and empty/loading/error state on one screen. Verifying a rebrand today
  requires inducing a Sokko fetch failure to see `--danger`. Nobody does that, so
  error states ship unbranded.

Rejected alternatives:

- *Ship a component library (shadcn-style `components/ui` with variants API).*
  Over-built for a nine-component storefront and it fights the SDK's headless
  premise. A shared class module plus four primitives covers it.
- *Config-driven theming in TypeScript (`theme.ts` consumed via CSS-in-JS).*
  Costs runtime, breaks server rendering of the grid, and CSS custom properties
  already do this natively with dark mode for free.
- *A `<select>` for catalogue sort.* Native default widget; a segmented group of
  server-rendered links needs no client JS, shows the current state, and is
  keyboard-navigable without a listbox contract.

## 3. Journey

### Entry points

Buyer: share link (WhatsApp/Instagram) → product page; or home → store → product.
Developer: `git clone` → `npm run dev` → `/` shows the setup notice → `/style`.

### Audience and exposure inventory

**Primary persona: a buyer on a mid-range Android phone on mobile data in Kenya.**
Not a developer. Cannot act on anything technical.

| Value rendered | Where | Action for this persona | Disposition |
| --- | --- | --- | --- |
| Raw `SokkoError.message` | `StoreError.tsx:7` | None. "fetch failed" is not actionable. | **TRANSLATE** — plain copy plus a retry button; raw text to `console.error` and a dev-only `<details>` gated on `NODE_ENV`. |
| Next.js error `digest` | new `app/error.tsx` | None. | **DROP** from the buyer's view; log it. |
| `NEXT_PUBLIC_SOKKO_STOREFRONT_ID` instructions | `SetupNotice.tsx` | None — but this surface's persona is the *developer*, pre-launch. | **KEEP.** Correctly addressed. Gate on `isStoreConfigured`, which is already how it renders. |
| `variantId` | cart drawer DOM ids only | None; never displayed. | **KEEP** (not rendered as text). |
| `installmentEligible` | fine print only | High: it is a purchase driver in this market. | **RELOCATE** — promote to a badge on the tile and beside the price. |

No secrets exist by construction: every variable is `NEXT_PUBLIC_` and checkout
runs on Sokko's origin.

### Happy path

1. Buyer opens `/store` on 3G. **Sees** a skeleton grid with the correct tile
   geometry within one frame, not a white page. **Does** nothing; content swaps in.
2. **Sees** tiles with price and, where eligible, an "Instalments" badge.
   **Does** tap one, or tap a sort chip (Newest / Price low / Price high).
3. Product page. **Sees** gallery, title, price, instalment badge, options.
   **Does** pick a variant and a quantity.
4. **Does** tap Buy now. **Sees** the pre-redirect notice already on screen, then
   "Taking you to Sokko."

### Next-action anticipation

- After **Add to basket**, the buyer's next act is either "keep shopping" or
  "check out". The confirmation is currently a button label change only. Add the
  basket count in the header as the persistent signal (already present) and keep
  `added` on the button; do not add a toast — the drawer is one tap away.
- After a **failed load**, the next act is *retry*, not *reload the page by
  hand*. Every error surface gets a real button.
- After an **empty basket**, the next act is browsing. The empty drawer routes
  to `/store` instead of showing `KES 0` and a dead Checkout button.
- After a **rebrand**, the developer's next act is checking they covered
  everything. `/style` is that surface.

### Exhaustive states

| State | Today | After |
| --- | --- | --- |
| Catalogue loading | white page | `app/store/loading.tsx` skeleton grid |
| Product loading | white page | `app/store/[slug]/loading.tsx` skeleton |
| Home loading | white page | `app/loading.tsx` |
| Render throw | Next default error page | `app/error.tsx` with `retry()` |
| Fetch failure | raw message, no retry | translated copy + retry + dev details |
| Catalogue empty (first run) | handled | kept, restyled |
| Catalogue empty (sorted to zero) | n/a | same shell, different copy |
| Basket empty | `KES 0` + disabled button | empty state routing to `/store` |
| Image absent | "No image yet" | kept |
| Image *failed* | broken-image glyph | falls back to the same placeholder |
| Image loading | pops in, reflows | reserved box + fade-in |
| Long product title | truncates on tile | 2 lines on the tile (`line-clamp-2`, height reserved), 2 lines in drawer |
| Offline | browser default | out of scope; no service worker in a template |

### Seller media, and what the template guarantees

A seller's photos arrive with their own backgrounds baked in. The live
catalogue has `#000000`, `#F2F2F2` and `#A5A5A5` behind three garments, and
bled to the card edge on a dark page the black one has no perceivable extent:
`--line` is a 1.28:1 hairline and `--surface` is 1.07:1 off `--page`. So the
tile frames instead of bleeding. `ProductImage frame` insets the photo on the
plate and gives it a `--line-strong` edge, held to 3:1 against `--page` in
every preset by `check:contrast`. The tile is then identical whatever was
uploaded, which is the only thing a template can promise here.

Ask sellers for one background per collection, but do not depend on it.

**Open, and not fixable here:** Sokko stores `_w240` and `_w400` renditions
only, and `primaryImageSrcSet` never offers the original. A 400w rendition in
a ~320 CSS px framed photo is a 1.6x upscale on a 2x display. Framing cut it
from 2.2x; closing the rest needs the SDK to offer the original as a
candidate, and source media above 600x600.

## 4. Design-spec compliance

Sources consulted: `app/globals.css` (token system), `lib/styles.ts` (control
classes), `AGENTS.md` (Styling / Copy / Server-and-client rules), `README.md`
(the rebrand contract), `.claude/skills/ui-nitpicker/references/*`.

Rules this work is bound by, from `AGENTS.md`:

- Tokens only, no hardcoded hex in `.tsx`. **This plan strengthens the rule** by
  moving type, radius, shadow, motion, aspect and rhythm into tokens too.
- No `dark:` overrides in components. Preserved — every preset ships its own
  dark block.
- Keep the focus outline. Preserved and tokenised (`--focus-ring`).
- No em dashes in buyer-facing copy. Applied to every new string in §7.
- Do not reimplement the SDK. No new `useState` for selection, quantity, drawer
  or gallery. The one new piece of local state is a *draft string* for the
  quantity text field, which exists solely to stop the SDK's clamp from
  fighting the keyboard (see §6 step 6); it is not a second source of truth.
- `lib/sokko.ts` / `lib/cart.ts` stay at module scope. Untouched.

**Tension raised and resolved:** `README` says three files carry the branding.
After this work it is four (`app/theme.css`, `app/fonts.ts`, `lib/site.ts`,
plus the preset you import). The README is updated rather than the structure
compromised — a typeface cannot be a CSS variable in `next/font`.

**Contract respected:** `storefront.fetchProducts({ sort })` passes `sort`
straight to Sokko's API and only `newest` is documented. Price ordering is
therefore applied **locally** over the fetched page, not by inventing an API
value. Commented at the call site.

## 5. Architecture

### Component tree

```
RootLayout (server)                     fonts, tokens, metadata, themeColor
├── Header (server)
│   ├── MobileNav (client)              disclosure: aria-expanded, Esc, focus return
│   └── CartDock (client)               SDK useCartDock; portal to body
│       ├── CartLineItem (client)       one line; reuses QuantityStepper
│       └── EmptyBasket (server)        routes to /store
├── main
│   ├── HomePage (server)               hero, featured
│   ├── StorePage (server)              searchParams -> SortLinks + grid
│   │   └── SortLinks (server)          segmented <Link> group, no client JS
│   ├── ProductPage (server)            + BreadcrumbList JSON-LD
│   │   ├── Gallery (client)            SDK useGallery
│   │   └── BuyPanel (client)           SDK useProductPurchase
│   │       ├── VariantPicker (client)
│   │       ├── QuantityStepper (client)
│   │       └── CheckoutNotice (server)
│   └── StyleGuide (server)             /style — the kit
└── Footer (server)

components/ui/ (shared primitives)
├── ProductImage (client)               aspect box, fade-in, load failure
├── Price (server)                      owns the "From " rule, once
├── Badge (server)                      instalments and neutral variants
├── Skeleton (server)                   pulse block
└── Notice (server)                     shell for setup / error / empty
```

### State table

| State | Rung | Owner |
| --- | --- | --- |
| Catalogue, product, related | server cache (ISR, `revalidate = 300`) | route segment |
| Sort order | **URL** (`?sort=`) | `/store` searchParams |
| Variant selection, quantity, `added`, checkout status | SDK store/hook | `useProductPurchase` |
| Basket lines | SDK `CartStore` (localStorage, module scope) | `lib/cart.ts` |
| Drawer open, focus contract | SDK hook | `useCartDock` |
| Active gallery image | SDK hook | `useGallery` |
| Quantity text draft | local, ephemeral | `QuantityStepper` |
| Image loaded / failed | local, ephemeral | `ProductImage` |
| Mobile nav open | local, ephemeral | `MobileNav` |

Sort lives in the URL because it must survive a share, a refresh and the back
button, and because keeping it there means the store page stays a server
component with zero client JS.

### Data flow

Reads: `loadCatalogue` / `loadProduct` / `loadRelated` in `lib/sokko.ts`, called
from server components; every failure is a returned state, never a throw.
`app/sitemap.ts` reuses `loadCatalogue` so an unconfigured clone still builds.
Writes: none on this origin. The only mutation is the local `CartStore`;
checkout is a full navigation to Sokko.

### File layout

New: `app/theme.css`, `app/themes/{mono,warm,bold}.css`, `app/fonts.ts`,
`app/loading.tsx`, `app/error.tsx`, `app/store/loading.tsx`,
`app/store/[slug]/loading.tsx`, `app/icon.tsx`, `app/opengraph-image.tsx`,
`app/sitemap.ts`, `app/robots.ts`, `app/style/page.tsx`,
`components/ui/{ProductImage,Price,Badge,Skeleton,Notice}.tsx`,
`components/store/{CartLineItem,EmptyBasket,ProductTileSkeleton,SortLinks}.tsx`,
`components/site/MobileNav.tsx`.

Changed: `app/globals.css` (mapping + base + utilities only; values move out),
`app/layout.tsx`, `app/page.tsx`, `app/store/page.tsx`,
`app/store/[slug]/page.tsx`, `app/not-found.tsx`, `components/site/{Header,Footer}.tsx`,
`components/store/{ProductTile,CatalogueGrid,BuyPanel,CartDock,Gallery,QuantityStepper,VariantPicker,SetupNotice,StoreError}.tsx`,
`lib/{styles,site}.ts`, `README.md`, `AGENTS.md`.

## 6. Implementation order

States first, so nothing renders before its skeleton and error paths exist.

1. **Tokens.** Split `app/theme.css` out of `globals.css`; add type, geometry,
   elevation, motion, rhythm and aspect tokens; map them in `@theme inline`;
   style `h1`–`h3` from display tokens in the base layer. *Done when* a build
   emits `bg-page`, `shadow-card`, `aspect-tile`, `space-y-section`, `font-display`.
2. **Fonts.** `app/fonts.ts` exporting a body/display pair as `--font-body` and
   `--font-title`. *Done when* headings render in the display face with no
   `font-*`/`tracking-*` class on them.
3. **Presets.** Three complete theme files. *Done when* swapping the import in
   `globals.css` visibly changes radius, ratio, elevation and colour with no
   `.tsx` edit.
4. **Primitives.** `Skeleton`, `Notice`, `Badge`, `Price`, `ProductImage`.
   *Done when* the "From " rule exists in exactly one file.
5. **States.** `loading.tsx` ×3, `error.tsx`, `EmptyBasket`, `StoreError`
   rewrite with retry. *Done when* every row of the §3 state table renders.
6. **Controls.** Quantity draft-string fix in `QuantityStepper`; drawer reuses
   it via `CartLineItem`; `type="text"` + `inputMode="numeric"` so the scroll
   wheel cannot change a quantity. *Done when* clearing the field and typing
   "12" yields 12, in both places.
7. **Rhythm.** One section scale applied across all four routes; the 80px
   breadcrumb gap removed. *Done when* no route sets an ad-hoc `space-y-*`.
8. **Boilerplate.** `icon`, `opengraph-image`, `sitemap`, `robots`, breadcrumb
   JSON-LD, instalment badges. *Done when* a fresh clone has correct share cards.
9. **Structure.** `MobileNav`, `SortLinks`, home page merchandising.
10. **Kit.** `/style`, `noindex`. *Done when* every primitive and state is on it.
11. **Docs.** README and AGENTS.md updated to the new contract.
12. **Gates.** `typecheck`, `lint`, `build` with no `.env`; Mode A self-sweep;
    Codex peer audit (policy: `required`).

## 7. Copy inventory

| Surface | String |
| --- | --- |
| Home hero CTA | `Shop the collection` |
| Home secondary | `See what is new` |
| Footer promises | `Pay by M-Pesa` / `Delivered across Kenya` / `Instalments on eligible items` |
| Home section | `Latest` · `See everything` |
| Store sort | `Newest` · `Lowest first` · `Highest first` (hidden below 6 products) |
| Catalogue empty (first run) | `Nothing on sale yet` / `Publish a product in your Sokko dashboard and it shows up here.` |
| Store result count | `3 items, newest first` |
| Store error | `The store did not load` / `Something went wrong on our side. Try again in a moment.` / button `Try again` |
| Route error | `Something went wrong` / `The page could not be shown. Try again, or go back to the store.` / `Try again` · `Back to the store` |
| Basket empty | `Your basket is empty` / `Add something from the collection and it shows up here.` / `Browse the store` |
| Basket footer | `Subtotal` / `Delivery is added at checkout.` |
| Instalment badge | `Instalments` |
| Image fallback | `No image yet` |
| Not found | `Not here` / `That page has moved or sold out. The rest of the collection is still up.` / `Back to the store` |
| Mobile nav trigger | `Menu` / `Close` |
| Style guide | `Style kit` / `Everything the theme controls, on one page. Delete this route before you go live if you like.` |

Removed: `Reload the page in a moment. If it keeps failing, the reason was: …`
(leaks a developer artefact and offers no control).

## 8. Self-review gate

Mode A sweep to run on the result:

- **Stunning** — one spacing scale across all routes; one radius family per
  theme; headings all from display tokens; hover, focus-visible and disabled on
  every control; dark mode checked on all three presets plus the default.
- **Intuitive** — every state in §3 exercised on screen via `/style`; no screen
  dead-ends without a next action; copy re-read against §7 for economy and the
  no-em-dash rule.
- **Engineering** — no component over ~120 lines; no `useEffect` added; no prop
  drilling past one level; catalogue grid still server-rendered and present in
  `curl` output; no hardcoded hex in any `.tsx`.
- **Gates** — `npm run typecheck && npm run lint && npm run build`, with the
  build run against a tree with no `.env`.


---

## Amendment 1 — the checkout handoff (2026-09-06)

Added after the four bundles landed, on review of `../charisma`, which stages
this departure with a curtain rather than a button label.

**Why the label lost.** "Taking you to Sokko" is a 14px change on the button
the buyer's thumb is covering, so the common outcome is a second tap. It also
left the page live: `buyNow` was disabled during the call but `addToBasket`
beside it was not, and nothing stopped a scroll, a basket open, or a tap
through to a related product while a cart was being priced. Then the origin
changed through a white flash.

**What was built.** `lib/useCheckoutHandoff.ts` plus
`components/store/CheckoutCurtain.tsx`, wired into `BuyPanel` and `CartDock`.

Two departures from Charisma's version, both deliberate:

- **It runs on the SDK, not around it.** Charisma's `useCheckoutHandoff`
  reimplements the checkout call. This one takes the SDK's documented
  `{ navigate: false }` seam and only owns the race, so idempotency keys,
  error state and resets stay with `useProductPurchase` / `useCartDock`.
- **No framer-motion.** CSS keyframes on the existing motion tokens, so the
  curtain rebrands with the theme and the template takes no new dependency.
  `onAnimationEnd` replaces `onAnimationComplete`.

Two failure modes Charisma's version does not cover, handled here:

- `isLeaving` is local state, not `checkoutStatus`. With `navigate: false` the
  SDK returns to `idle` the moment the URL arrives, so reading its status
  would retract the curtain on exactly the fast connection it covers.
- A `pageshow` listener clears the handoff when the browser restores this page
  from the back/forward cache. Without it, pressing back from Sokko returns
  the buyer to a curtain over a store they cannot touch.

A 1500ms failsafe calls `onCovered` if `animationend` never arrives, because a
curtain that never lifts on a payment flow is the worst available outcome.


---

## Amendment 2 — light and dark as one value (2026-09-06)

**The audit that prompted it.** Nine token pairs, four themes, two modes. Two
real failures, both in `bold` light mode: `--danger` on `--surface` at 4.40
(the `StoreError` title) and `--success` inside its tinted badge at 3.25. Both
darkened, both now clear. `--line` measured ~1.3:1 against `--page` in every
theme and was deliberately left alone: WCAG 1.4.11 governs boundaries required
to identify a control, and these are decorative hairlines. Holding them to 3:1
would flatten all four themes. The focus ring carries that requirement and
passes everywhere.

**The structural change.** Every colour moved from a `:root` block plus a
`@media (prefers-color-scheme: dark)` block to a single `light-dark(l, d)`
value, with `color-scheme: light dark` on `:root`.

Chosen over two alternatives:

- *Leave it OS-driven and document DevTools emulation.* Free and it exercises
  the real code path, but it does nothing about the actual defect: `--brand`
  was defined twice, forty lines apart, and changing one and forgetting the
  other failed silently.
- *Add a `[data-scheme]` override beside the media query.* Duplicates every
  dark block a second time and creates a second way to be dark, so a preview
  could drift from what buyers get. A preview that can lie is worse than none.

Three things fell out of it:

- `color-scheme` was previously unset, so the cart drawer's scrollbar and the
  text field internals stayed light on a dark page. Now correct.
- `color-scheme` inherits, so `/style` renders both modes side by side from
  one set of values rather than flipping between them.
- The browser-floor worry was unfounded. Lightning CSS lowers `light-dark()`
  to a paired custom-property switch, including on the `scheme-*` classes, so
  it works down to Next's browserslist targets rather than Baseline 2024.

`html.scheme-light` / `html.scheme-dark` needed their own rules: a bare class
ties with `:root` on specificity and loses on source order, so the utility
alone would silently do nothing on the element a real switcher targets.

`scripts/check-contrast.mjs` now runs the audit above as `npm run
check:contrast`, reading the token files directly so a new preset is covered
the moment it lands.
