'use client';

import { createCartStore } from '@sokkoke/storefront-react';

/**
 * The basket lives in this browser only. Sokko's cart is created once, at
 * checkout, from the variant ids and quantities held here.
 *
 * Created at module scope on purpose: the SDK hooks key their subscriptions
 * to this instance, so a store rebuilt per render would drop the basket.
 *
 * `namespace` prefixes the storage key. Change it to your own site's name so
 * two Sokko storefronts on one origin cannot read each other's baskets.
 */
export const cart = createCartStore({ namespace: 'sokko-template' });
