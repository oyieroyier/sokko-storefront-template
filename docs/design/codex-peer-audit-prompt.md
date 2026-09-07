You are performing an ADVERSARIAL code review. Assume there is at least one meaningful flaw and search for it. Do not praise. Do not say LGTM. A clean verdict must be earned by concrete inspection.

Review the current working tree, including staged, unstaged, and untracked files. Use git commands to inspect the diff and relevant surrounding code. Do not modify files.

Project: a Next.js 16.3.4 (App Router, Turbopack) / React 19 / Tailwind CSS v4 storefront template built on the headless SDK `@sokkoke/storefront-react` (source of truth for its API: node_modules/@sokkoke/storefront-react/dist/*.d.ts and *.js). Read AGENTS.md and README.md for the project's rules. The plan the change implements is docs/design/storefront-uplift-plan.md.

SCOPE: Claude-authored frontend LOGIC and ENGINEERING only. Visual taste, colour choices, spacing values and copy tone are explicitly OUT of scope and must not be reported. Do not propose design alternatives.

Investigate these, in priority order. For each, actually read the code and reason about concrete execution, do not skim:

1. STATE AND DATA FLOW
   - components/store/QuantityStepper.tsx introduces a draft-string pattern: local `draft` state, `shown = draft ?? String(quantity)`, commit on blur and on Enter. Try to break it. Consider: the SDK clamps via `setQuantity`; what happens when the committed value equals the current quantity (does the field reset?); pasting non-numeric text; "0"; "-5"; "007"; a value above maxQuantity; leading/trailing spaces; the buyer clicking the +/- buttons while a draft is uncommitted; the component being reused for a different cart line (React key/identity — see components/store/CartDock.tsx which keys CartLineItem by variantId); `Number.parseInt('12abc')`.
   - components/ui/ProductImage.tsx: the `onMount` callback ref checks `node.complete && node.naturalWidth === 0`. Is that sound? Consider src changing between renders (the Gallery swaps `activeImage` on the same mounted <img>) — `hasFailed` is never reset, so does a successful image after a failed one stay hidden? Check components/store/Gallery.tsx.
   - components/site/MobileNav.tsx: Escape handling via onKeyDown on a wrapper div, focus return on close, no document listener and no effect. What cases does that miss (focus outside the wrapper, click outside, route change by other means, aria-controls pointing at an element that does not exist while closed)?

2. BACKEND-CONTRACT CONSUMPTION
   - lib/sokko.ts injects `fetch: (input, init) => fetch(input, { ...init, next: { revalidate: CATALOGUE_TTL } })` into the SDK's `createStorefront`. This same client instance is used in the browser (components/store/*.tsx via hooks) and on the server. Is that safe and correct? Does it break `startCheckout` (a POST — check dist/client.js) by caching it or by interacting with the idempotency key? Does it break AbortSignal usage? Does it recurse or shadow anything?
   - components/store/SortLinks.tsx `sortProducts` / `parseSort`: correctness of the comparator, stability, mutation of the input array, products with no price, and whether the URL value is validated before use.
   - app/sitemap.ts reuses loadCatalogue with limit 200 while app/store/page.tsx uses 48. Any inconsistency or failure mode?

3. LOADING / ERROR / RETRY
   - app/error.tsx uses the Next 16 prop name `retry` (not `reset`). Verify against node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md and the actual Next runtime types.
   - components/store/StoreError.tsx uses useTransition + router.refresh() and is rendered from server components that returned an error STATE (never a throw). Does the retry actually do anything given `export const revalidate = 300` on the routes and the injected data-cache fetch? Is the claim in its doc comment accurate?
   - The three loading.tsx files and whether they can ever be shown given the routes' static/dynamic classification.

4. ACCESSIBILITY SEMANTICS
   - MobileNav disclosure, `aria-controls` referencing an id that only exists when open.
   - SortLinks `aria-current="true"` on a link (correct value is usually "page" for navigation) .
   - CartDock basket trigger `aria-label` overriding visible text, and whether the label matches the visible content.
   - QuantityStepper labelling when reused per cart line (`label` prop becomes the aria-label and drives the +/- button labels); duplicate ids or duplicate accessible names across lines.
   - app/layout.tsx skip link.

5. RENDERING AND PERFORMANCE
   - components/ui/ProductImage.tsx is a client component used by the server-rendered components/store/ProductTile.tsx. Confirm the catalogue grid markup (img with src/srcSet) is still present in server HTML, and quantify the hydration cost for a 48-tile grid.
   - /store now reads searchParams and is dynamically rendered (confirmed: `ƒ /store` in the build output). Is the injected `next: { revalidate }` data cache an adequate mitigation, or does something defeat it?

Also apply the general adversarial checklist: swallowed errors, changed defaults, hydration mismatches, resource leaks, dead code, comments that disagree with the code, overly permissive types or casts.

Return findings in EXACTLY this format:

## Verdict

BLOCK | CAUTION | PASS

## Findings

### P0/P1/P2/P3: [short title]

- Evidence: `path:line` or command/diff reference
- Failure mode: [what breaks, leaks, corrupts, regresses, or becomes ambiguous]
- Trigger/reproduction: [specific input, state, request, race, browser condition]
- Confidence: [confirmed | probable | needs-verification, plus what evidence is missing]
- Why existing tests miss it: [or say covered by X]
- Recommended fix: [minimal fix direction]

## Checks performed

- [commands, files, call sites, schemas, docs inspected]

## Coverage gaps

- [what was not reviewed and why]

Report uncertain and low-severity findings with an explicit confidence level rather than dropping them.

---

## Status: INCONCLUSIVE (not a pass)

Attempted 2026-09-06. `codex login status` reports "Logged in using ChatGPT", but every
model this CLI offers is rejected:

    ERROR 400 invalid_request_error:
    The '<model>' model is not supported when using Codex with a ChatGPT account.

Tried: gpt-5.6-sol (the resolved default from collab-config), gpt-5.6,
gpt-5.1-codex-max, gpt-5.1-codex, gpt-5-codex, gpt-5.1, o3. All unsupported.

Resume once Codex has a usable model:

    cat docs/design/codex-peer-audit-prompt.md | codex exec -s read-only --cd "$PWD" \
      -m <supported-model> -c model_reasoning_effort=high -
