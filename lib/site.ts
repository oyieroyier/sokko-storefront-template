/**
 * Everything about the brand that is not a colour or a font. Edit this file
 * and the theme tokens in app/theme.css, and the template is rebranded.
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
  /**
   * Delivery, payment and instalments, said once. These belong in the footer,
   * not under the hero: they answer a question the buyer asks at checkout, and
   * a store whose loudest promise is "we deliver" is selling delivery. An
   * empty array hides the row.
   */
  promises: ['Pay by M-Pesa', 'Delivered across Kenya', 'Instalments on eligible items'],
  /** Drop links you do not use. An empty array hides the row. */
  social: [
    { href: 'https://instagram.com/', label: 'Instagram' },
    { href: 'https://twitter.com/', label: 'X' }
  ],
  /** Shown in the footer next to the year. */
  legalName: 'Your Store',
  /**
   * Three places cannot read a CSS variable: the generated share card, the
   * generated favicon, and the browser chrome colour. They are the only
   * duplicates of app/theme.css in the codebase, so they live together here
   * with a note to change them together.
   */
  chrome: {
    /** --page and --brand from :root in app/theme.css. */
    page: '#fcfcfb',
    ink: '#16161a',
    brand: '#16161a',
    brandInk: '#fcfcfb',
    /** --page from the dark block. */
    pageDark: '#0c0c0e'
  }
} as const;
