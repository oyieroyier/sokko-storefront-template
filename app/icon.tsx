import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

/** The favicon, drawn from the store name. Replace with a real mark when
 *  the client has one: drop icon.png or icon.svg in app/ and delete this. */
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: site.chrome.brand,
          color: site.chrome.brandInk,
          fontSize: 20,
          fontWeight: 700
        }}
      >
        {site.name.trim().charAt(0).toUpperCase()}
      </div>
    ),
    size
  );
}
