import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

/**
 * The card WhatsApp, X and Slack draw when somebody shares the store.
 *
 * Generated rather than dropped in as a PNG, so it is already correct on a
 * fresh clone and a rebrand updates it without opening a design tool. Colours
 * come from site.chrome: an ImageResponse runs outside the document and
 * cannot read a CSS variable.
 *
 * Product pages override this with the product photo, from generateMetadata.
 */
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: site.chrome.page,
          color: site.chrome.ink,
          padding: 80
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ fontSize: 40, color: site.chrome.brand, opacity: 0.7 }}>{site.tagline}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: site.chrome.brand,
              color: site.chrome.brandInk,
              fontSize: 26,
              padding: '12px 24px',
              borderRadius: 999
            }}
          >
            Pay by M-Pesa
          </div>
          <div style={{ fontSize: 26, opacity: 0.6 }}>Delivered across Kenya</div>
        </div>
      </div>
    ),
    size
  );
}
