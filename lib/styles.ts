/**
 * Shared control classes, so a button and a link that look the same are the
 * same string. Every value here resolves to a theme token, which is what lets
 * app/globals.css rebrand the whole site.
 */
export const control =
  'inline-flex items-center justify-center gap-2 rounded-control px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export const primaryButton = `${control} bg-brand text-brand-ink hover:opacity-90`;

export const secondaryButton = `${control} border border-line bg-page text-ink hover:bg-surface`;

export const quietButton = `${control} px-3 text-muted hover:text-ink`;
