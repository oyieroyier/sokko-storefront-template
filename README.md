# Sokko storefront template

A working merch store on your own domain, selling your Sokko catalogue. Next.js
App Router, TypeScript, Tailwind, and [`@sokkoke/storefront-react`](https://www.npmjs.com/package/@sokkoke/storefront-react).

Clone it, paste one id, and you have a store. Change the theme tokens and the
site config, and it is the client's store.

## What Sokko owns, what you own

Sokko owns the money. Checkout, M-Pesa, instalments, delivery and repricing all
happen on Sokko's checkout page. This site never touches payments, addresses or
inventory holds, which is why it needs no API key and no server secrets: it
reads Sokko's public storefront endpoints and hands the buyer over at the end.

You own every pixel. The SDK ships logic and structure with no styling layer.
Everything in `app/` and `components/` here is a suggestion you are meant to
replace.

## Quick start

```bash
npm install
cp .env.example .env.local     # then set NEXT_PUBLIC_SOKKO_STOREFRONT_ID
npm run dev
```

The storefront id is in the Sokko seller dashboard under **Settings →
Developers**. That page shows your real value. Until you set it, the store
pages render a short setup notice instead of failing.

## Make it yours

Three files carry almost all of the branding.

| File | What to change |
| --- | --- |
| `app/globals.css` | The whole theme. Colours, radii and the font token live in `:root` and the dark block under it. `--brand` is usually the only colour a store needs to change. |
| `lib/site.ts` | Name, tagline, description, nav, social links, public URL. |
| `app/layout.tsx` | The typeface. One `next/font` import feeds the `--font-body` token. |

After that, edit copy in `app/page.tsx` and `app/store/page.tsx`, drop a favicon
and an `opengraph-image` in `app/`, and the store is the client's.

Components read tokens through Tailwind utilities (`bg-surface`, `text-muted`,
`border-line`, `bg-brand`, `rounded-card`). Keep it that way and a rebrand stays
a one-file change.

## How it is wired

Product pages render on the server, so search engines and WhatsApp get the real
title, price and image rather than a loading state. The SDK client is plain
`fetch`, so a server component can call it directly.

```
lib/sokko.ts             one storefront client, shared by server and browser
lib/cart.ts              the basket, created once at module scope
lib/site.ts              brand config
app/store/page.tsx       catalogue, fetched and rendered on the server
app/store/[slug]/        product page, plus generateMetadata and Product JSON-LD
components/store/        tiles and grid (server), gallery, picker, buy panel,
                         cart drawer (client)
```

The split is deliberate:

- **Server**: anything that is content. Catalogue grid, product title and
  description, share tags, structured data. These use the SDK's plain functions
  (`fromPrice`, `productImages`, `primaryImageSrcSet`).
- **Client**: anything the buyer touches. `useProductPurchase`, `useGallery` and
  `useCartDock` carry the state, the resets and the modal contract. Client
  components still server-render their first frame, so the main product image is
  in the HTML too.

Pages revalidate every five minutes (`export const revalidate = 300`). Lower it
during a drop, raise it for a catalogue that rarely changes.

## Facts about the Sokko API that shape this code

Do not fight these. They are already handled.

- **KES amounts are whole shillings.** `formatPrice(1500)` is `KES 1,500`. Never
  divide by 100.
- **Media paths are root-relative** and must be rebased, or they 404 on your
  domain. The client does it. Read images through `storefront.productImages()`.
- **The basket is local to the browser.** A Sokko cart is created once, at
  checkout, from variant ids and quantities. The title and price stored on a
  basket line are for display only, so a stale local price can never become a
  stale charge.
- **Checkout is a full navigation to Sokko.** Say so before it happens. The
  `CheckoutNotice` component renders the SDK's proven wording, including the
  instalment line on eligible items.
- **Related products come from this catalogue only.** Sokko's recommender covers
  the whole marketplace and could put another seller's product under your
  masthead.
- **Write requests need an idempotency key.** The client attaches one.

## Deploy

Any Node host. Vercel is the shortest path: import the repo, set
`NEXT_PUBLIC_SOKKO_STOREFRONT_ID` and `NEXT_PUBLIC_SITE_URL`, deploy.

Everything here is public by design. There are no server-side secrets to leak,
which is why every variable is `NEXT_PUBLIC_`.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` succeeds with no `.env` at all, so a fresh clone always builds.
