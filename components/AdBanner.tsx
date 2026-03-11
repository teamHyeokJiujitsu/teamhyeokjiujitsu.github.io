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
          <aside className="ad-banner__disclosure" aria-label="쿠팡 파트너스 고지">
            <strong className="ad-banner__disclosure-label">유료광고</strong>
            <span>이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</span>
          </aside>
        </div>
        <span className="ad-banner__text">특가 보러가기</span>
      </a>
    </div>
  );
}
