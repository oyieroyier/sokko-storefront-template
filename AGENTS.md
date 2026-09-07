# Working in this repo

A client's merch storefront built on `@sokkoke/storefront-react`. Read
`README.md` first. These are the rules that are easy to break by accident.

## Do not reimplement the SDK

`useProductPurchase`, `useCartDock`, `useGallery` and `useVariantSelection`
already carry the state, the resets and the modal contract. If a component here
is growing its own `useState` for a selection, a quantity or a drawer, the wiring
is wrong. Reach for the hook.

Equally, do not build a checkout. Payment, delivery, instalments and repricing
happen on Sokko. This site creates a guest cart and navigates away.

## Money

- KES amounts are whole shillings. Use `formatPrice`. Never divide by 100.
- A price shown here is a display value. Sokko reprices every line at checkout.
  Never present a local subtotal as a quote, and never imply a total is final.

## Styling

Every design decision is a token in `app/theme.css`. `app/globals.css` only
wires those tokens to Tailwind utilities; it holds no values.

- **Colour**: `bg-page`, `bg-surface`, `text-muted`, `border-line`, `bg-brand`,
  `text-danger`. No hardcoded hex in `.tsx`, ever.
- **Geometry**: `rounded-card`, `rounded-control`, `rounded-pill`,
  `aspect-tile`. Not `rounded-lg`, not `aspect-square` on a product photo.
- **Elevation**: `shadow-card`, `shadow-raised`. Nothing else.
- **Motion**: `transition-brand` for state, `transition-entrance` for things
  that arrive. Not `transition-colors`, not `duration-300`.
- **Rhythm**: `space-y-section` between top-level sections, `space-y-block`
  inside one, `space-y-tight` between a heading and its paragraph. A one-off
  `space-y-7` is a bug: it means a page invented its own scale.
- **Headings** take their face, weight and tracking from the base layer. Put a
  size utility on an `h1` and nothing else. `font-semibold tracking-tight` on a
  heading overrides the theme and breaks every preset.
- No `dark:` overrides in components, and no second palette. Every colour in
  `app/theme.css` is `light-dark(light, dark)`, resolved by `color-scheme` on
  `:root`. Adding a colour means adding both halves on one line.
- Run `npm run check:contrast` after touching any colour. It holds every text
  pair in every theme, in both modes, to WCAG AA, and it is what catches the
  ones nobody looks at.
- Keep the focus outline in `globals.css`. Buyers navigate stores by keyboard.

Check a change on `/style` before you check it on the store. It renders every
token, control and state on one page, including the ones you cannot reproduce
on demand.

## States are not optional

A screen is not done until all of its states are. Every route has a
`loading.tsx`; anything that can throw is covered by `app/error.tsx`; every
failure surface offers a retry, not an instruction to reload.

Nothing a buyer cannot act on reaches a buyer's screen. A raw error message, a
`digest`, a variant id and a provider reference are all developer artefacts:
log them, or put them behind a `NODE_ENV` check. `StoreError` is the worked
example.

## Copy

Short, plain, active. No em dashes in anything a buyer reads: use a full stop, a
comma or a colon. No marketing adjectives on a button.

Tell the buyer before the origin changes, and stage the change itself. The
checkout notice is not decoration, and `CheckoutCurtain` is not an animation:
it covers the page, stops it scrolling, and holds until Sokko answers, so the
handoff is never a white flash onto another domain.

Start a checkout with the SDK's `{ navigate: false }` and hand the URL to
`useCheckoutHandoff`. Do not drive the curtain off `checkoutStatus`: with
`navigate: false` the SDK returns to `idle` as soon as the URL lands, which is
the fast connection the curtain exists for. Any control that edits the order
is disabled while `isLeaving`.

## Server and client

Content renders on the server, interaction on the client. Before adding
`'use client'` to a file, check whether the SDK exposes a plain function that
does the same job. `fromPrice`, `productImages`, `primaryImageSrcSet`,
`optionGroups` and `matchVariant` all run anywhere.

`lib/sokko.ts` and `lib/cart.ts` create their instances at module scope. Leave
them there. The hooks key their effects on the instance, and one rebuilt per
render refetches forever.

The storefront client is given an injected `fetch` that carries Next's
`revalidate`. That is what stops a dynamically rendered route from hitting
Sokko once per visitor. Do not replace it with a bare `fetch`.

`sort` reaches Sokko as an opaque string and only `newest` is published. Price
ordering is applied locally in `sortProducts`. Do not invent an API value.

## Before you call it done

```bash
npm run typecheck && npm run lint && npm run build
```

The build must pass with no `.env`. A fresh clone has to build.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
