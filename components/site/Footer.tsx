import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
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
                  className="text-sm text-muted transition-colors hover:text-ink"
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
