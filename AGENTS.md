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

- Tokens only. Every colour comes from `app/globals.css` through a Tailwind
  utility (`bg-surface`, `text-muted`, `border-line`, `bg-brand`). No hardcoded
  hex in `.tsx`.
- No `dark:` overrides in components. The tokens handle dark mode.
- Keep the focus outline in `globals.css`. Buyers navigate stores by keyboard.

## Copy

Short, plain, active. No em dashes in anything a buyer reads: use a full stop, a
comma or a colon. No marketing adjectives on a button.

Tell the buyer before the origin changes. The checkout notice is not decoration.

## Server and client

Content renders on the server, interaction on the client. Before adding
`'use client'` to a file, check whether the SDK exposes a plain function that
does the same job. `fromPrice`, `productImages`, `primaryImageSrcSet`,
`optionGroups` and `matchVariant` all run anywhere.

`lib/sokko.ts` and `lib/cart.ts` create their instances at module scope. Leave
them there. The hooks key their effects on the instance, and one rebuilt per
render refetches forever.

## Before you call it done

```bash
npm run typecheck && npm run lint && npm run build
```

The build must pass with no `.env`. A fresh clone has to build.
