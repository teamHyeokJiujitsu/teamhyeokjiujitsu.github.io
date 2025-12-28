'use client';

const COUPANG_TRACKING_CODE = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID ?? 'AF8593380';
const COUPANG_TEMPLATE_ID = Number.parseInt(process.env.NEXT_PUBLIC_COUPANG_TEMPLATE_ID ?? '784777', 10);
const TEMPLATE_ID = Number.isFinite(COUPANG_TEMPLATE_ID) ? COUPANG_TEMPLATE_ID : 784777;

const COUPANG_LINK = 'https://link.coupang.com/a/diSftp';

export default function AdBanner() {
  return (
    <div className="ad-banner" aria-live="polite">
      <a
        className="ad-banner__frame ad-banner__cta"
        href={COUPANG_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="ad-banner__brand">coupang</span>
        <span className="ad-banner__text">특가 보러가기</span>
      </a>
    </div>
  );
}
