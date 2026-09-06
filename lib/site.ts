/**
 * Everything about the brand that is not a colour or a font. Edit this file
 * and the theme tokens in app/globals.css, and the template is rebranded.
 */
export const site = {
  name: 'Your Store',
  /** One line under the masthead. Keep it short. */
  tagline: 'Official merch, shipped across Kenya.',
  /** Used for the home page intro and the default share description. */
  description:
    'Shop the official collection. Pay by M-Pesa, or in instalments on eligible items.',
  /** Your public URL. Drives canonical links and share cards. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/store', label: 'Store' }
  ],
  /** Drop links you do not use. An empty array hides the row. */
  social: [
    { href: 'https://instagram.com/', label: 'Instagram' },
    { href: 'https://twitter.com/', label: 'X' }
  ],
  /** Shown in the footer next to the year. */
  legalName: 'Your Store'
} as const;
