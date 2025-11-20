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
  const isConfigured = adClientId !== FALLBACK_CLIENT_ID && adSlotId !== FALLBACK_SLOT_ID;
  const shouldUseTestAds = process.env.NODE_ENV !== 'production';
  useEffect(() => {
    if (!isConfigured) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Google AdSense 광고 단위 또는 클라이언트 ID가 기본값을 사용 중입니다. 승인된 값으로 설정하지 않으면 403이 발생할 수 있습니다.',
        );
      }
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
    return shouldUseTestAds ? (
      <div className="ad-banner ad-banner--warning">
        <div className="badge badge--warning">개발 환경</div>
        <div className="small">
          Google AdSense 설정이 비어 있거나 기본값을 사용 중이라 광고 요청이 403으로 차단될 수
          있습니다. 아래를 확인하세요.
        </div>
        <ul className="ad-banner__list">
          <li>
            .env 파일에 `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, `NEXT_PUBLIC_ADSENSE_SLOT_ID`를 승인된 값으로
            채워주세요.
          </li>
          <li>AdSense 콘솔에서 도메인이 “사이트”에 추가되고 승인되었는지 확인하세요.</li>
          <li>개발 모드에서는 테스트 광고로 동작하지만, 실제 광고 노출을 위해서는 위 설정이 필수입니다.</li>
        </ul>
      </div>
    ) : null;
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

