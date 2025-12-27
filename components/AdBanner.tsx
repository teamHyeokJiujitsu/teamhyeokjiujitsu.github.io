'use client';

const COUPANG_TRACKING_CODE = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID ?? 'AF8593380';
const COUPANG_TEMPLATE_ID = Number.parseInt(process.env.NEXT_PUBLIC_COUPANG_TEMPLATE_ID ?? '784777', 10);
const TEMPLATE_ID = Number.isFinite(COUPANG_TEMPLATE_ID) ? COUPANG_TEMPLATE_ID : 784777;

const IFRAME_HEIGHT = 160;

export default function AdBanner() {
  const src = `https://ads-partners.coupang.com/widgets.html?id=${encodeURIComponent(
    TEMPLATE_ID,
  )}&template=carousel&trackingCode=${encodeURIComponent(
    COUPANG_TRACKING_CODE,
  )}&subId=&width=100%&height=${IFRAME_HEIGHT}&ts=${Date.now()}`;

  return (
    <div
      className="ad-banner"
      aria-live="polite"
      style={{
        position: 'relative',
        minHeight: IFRAME_HEIGHT,
        overflow: 'hidden',
      }}
    >
      <iframe
        title="Coupang Partners Carousel"
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        loading="lazy"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}
