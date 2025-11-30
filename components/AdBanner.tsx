'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

const FALLBACK_CLIENT_ID = 'ca-pub-2370970936034063';
const FALLBACK_SLOT_ID = '1234567890';

export default function AdBanner() {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? FALLBACK_CLIENT_ID;
  const adSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? FALLBACK_SLOT_ID;
  const isClientDefault = adClientId === FALLBACK_CLIENT_ID;
  const isSlotDefault = adSlotId === FALLBACK_SLOT_ID;
  const isConfigured = !isClientDefault && !isSlotDefault;
  const shouldUseTestAds = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    if (!isConfigured) {
      console.warn(
        '[AdSense] 승인된 `NEXT_PUBLIC_ADSENSE_CLIENT_ID`/`NEXT_PUBLIC_ADSENSE_SLOT_ID`가 없어 광고 요청이 중단됩니다. .env.local을 확인하세요.',
      );
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (err) {
      console.error(err);
    }
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <div className="ad-banner ad-banner--warning">
        <div className="badge badge--warning">광고 미표시</div>
        <div className="small">
          {isClientDefault || isSlotDefault
            ? 'AdSense 클라이언트 ID 또는 광고 단위가 기본값으로 설정되어 있어 광고가 노출되지 않습니다.'
            : 'AdSense 설정이 비어 있어 광고가 노출되지 않습니다.'}
        </div>
        <ul className="ad-banner__list">
          <li>
            `.env.local`에 승인된 `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, `NEXT_PUBLIC_ADSENSE_SLOT_ID` 값을 입력했는지 확인하세요.
          </li>
          <li>AdSense 콘솔에서 도메인을 “사이트”에 등록·승인했는지 확인하세요.</li>
          <li>네트워크 필터(Adblock)나 브라우저 보안 설정으로 요청이 차단되지 않는지 확인하세요.</li>
        </ul>
        <div className="small">
          {shouldUseTestAds
            ? '개발 환경에서는 테스트 광고(data-adtest="on")로만 요청합니다.'
            : '프로덕션에서는 승인된 값이 없으면 광고 요청이 생성되지 않습니다.'}
        </div>
      </div>
    );
  }

  return (
    <div className="ad-banner">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClientId}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(shouldUseTestAds ? { 'data-adtest': 'on' } : {})}
      ></ins>
    </div>
  );
}
