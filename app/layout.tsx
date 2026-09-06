import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { site } from '@/lib/site';
import './globals.css';

// One font, exposed as the token app/globals.css reads. Swap the import and
// the variable name here to change the typeface for the whole site.
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={body.variable}>
      {/*
        suppressHydrationWarning covers this element's own attributes, one level
        deep, not its children. Password managers, theme switchers and colour
        pickers all write attributes onto <body> before React hydrates, and
        without this the first console message a developer sees is a hydration
        mismatch caused by their own browser. Real mismatches inside the app
        still report normally.
      */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Header />
        <main className="container-page py-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
