import type { Metadata, Viewport } from 'next';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { ThemeDemoBar } from '@/components/site/ThemeDemoBar';
import { fontVariables } from '@/app/fonts';
import { site } from '@/lib/site';
import { themeBootScript } from '@/lib/themes';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url
  },
  twitter: { card: 'summary_large_image' }
};

/** Paints the phone's browser chrome to match the page instead of grey. */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: site.chrome.page },
    { media: '(prefers-color-scheme: dark)', color: site.chrome.pageDark }
  ]
};

/*
 * The theme class. Empty means app/theme.css as written, which is what most
 * stores want. Set it to a preset from app/themes to wear that identity
 * instead — and read the preset's file header, because two of the three also
 * expect a display face swapped in app/fonts.ts.
 *
 *   'theme-neobrutalist' | 'theme-editorial' | 'theme-soft'
 *
 * It sits on <html> so it reaches the portalled cart drawer too.
 */
const theme = '';

/*
 * The demo switcher: a bar on the real store that swaps themes, for showing a
 * client four looks without four deploys. Off unless NEXT_PUBLIC_THEME_DEMO=1,
 * because a shop that lets buyers restyle it is not a shop. Nothing below
 * renders in a normal build.
 */
const themeDemo = process.env.NEXT_PUBLIC_THEME_DEMO === '1';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * suppressHydrationWarning here covers one case only: the demo bar's boot
     * script adds a theme class to <html> before React hydrates, so the server
     * and client class strings differ by design. Without the demo enabled
     * nothing writes to this element and the attribute changes nothing.
     */
    <html lang="en" className={`${theme} ${fontVariables}`} suppressHydrationWarning>
      {/*
        suppressHydrationWarning covers this element's own attributes, one level
        deep, not its children. Password managers, theme switchers and colour
        pickers all write attributes onto <body> before React hydrates, and
        without this the first console message a developer sees is a hydration
        mismatch caused by their own browser. Real mismatches inside the app
        still report normally.
      */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        {themeDemo && (
          // Before the first paint, so a reload does not flash the default theme.
          <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        )}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:border focus:border-line focus:bg-page focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <Header />
        <main className="container-page py-block" id="main">
          {children}
        </main>
        <Footer />
        {themeDemo && <ThemeDemoBar />}
      </body>
    </html>
  );
}
