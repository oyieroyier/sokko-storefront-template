import { site } from '@/lib/site';

export function Footer() {
  // No `mt-section` on the footer. `main` already carries `py-block`, and
  // stacking the two makes the gap above the footer 6.5rem, which is not a
  // value the scale defines. Its own `py-*` below is where its air comes from.
  return (
    <footer className="border-t border-line">
      {/*
        The delivery and payment promises live here, quietly, on every page,
        rather than as a banner under the hero. A buyer looks for them when
        they are deciding to pay, and that is the end of the page.
      */}
      {site.promises.length > 0 && (
        <div className="container-page">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line py-5 text-sm text-muted">
            {site.promises.map((promise) => (
              <li key={promise}>{promise}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="container-page flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} {site.legalName}
        </p>

        {site.social.length > 0 && (
          <ul className="flex gap-5">
            {site.social.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted transition-brand hover:text-ink"
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm text-muted">Payments and delivery by Sokko.</p>
      </div>
    </footer>
  );
}
