'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'coupang-card-dismissed-at';
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000;

export default function AdBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissedAt: string | null = null;
    try {
      dismissedAt = localStorage.getItem(STORAGE_KEY);
    } catch {}
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (Number.isFinite(elapsed) && elapsed < DISMISS_DURATION_MS) return;
    }
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {}
  };

  if (!visible) return null;

  return (
    <aside className="coupang-card" aria-label="추천 상품 광고">
      <div className="coupang-card__header">
        <span className="coupang-card__label">AD</span>
        <button
          type="button"
          className="coupang-card__close"
          onClick={handleClose}
          aria-label="광고 닫기"
        >
          <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
            <path
              d="M2 2 L12 12 M12 2 L2 12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
      <div className="coupang-card__media">
        <iframe
          src="https://coupa.ng/cmHL4B"
          width="120"
          height="240"
          frameBorder={0}
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 추천 상품"
          loading="lazy"
        />
      </div>
      <p className="coupang-card__notice">
        파트너스 활동의 일환으로 일정액의 수수료를 받습니다.
      </p>
    </aside>
  );
}
