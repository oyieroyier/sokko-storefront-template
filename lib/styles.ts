/**
 * Shared control classes, so a button and a link that look the same are the
 * same string. Every value here resolves to a theme token, which is what lets
 * app/theme.css rebrand the whole site.
 */
export const control =
  'inline-flex items-center justify-center gap-2 rounded-control px-5 py-2.5 text-sm font-medium transition-brand disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

export const primaryButton = `${control} bg-brand text-brand-ink hover:opacity-90 active:scale-[0.98]`;

export const secondaryButton = `${control} border border-line bg-page text-ink hover:bg-surface active:scale-[0.98]`;

export const quietButton = `${control} px-3 text-muted hover:text-ink`;

/** A small square-ish control, for icons and disclosure triggers. */
export const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-control border border-line text-ink transition-brand hover:bg-surface';

/**
 * Inline code inside body copy. Bordered and filled so it reads as a value to
 * copy rather than as emphasis, which a bare `font-mono` does not.
 */
export const codeChip =
  'rounded-control border border-line bg-page px-1.5 py-0.5 font-mono text-xs text-ink';

/** The panel every notice, empty state and error shares. */
export const surfaceCard = 'rounded-card border border-line bg-surface shadow-card';
