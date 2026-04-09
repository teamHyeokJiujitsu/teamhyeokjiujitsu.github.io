'use client';

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
        <div className="ad-banner__header">
          <span className="ad-banner__brand">coupang</span>
        </div>
        <span className="ad-banner__text">특가 보러가기</span>
      </a>
    </div>
  );
}
