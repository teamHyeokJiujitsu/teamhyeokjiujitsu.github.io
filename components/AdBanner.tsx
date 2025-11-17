'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

export default function AdBanner() {
  const adClientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-2370970936034063';
  const adSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? '1234567890';
  const isConfigured = adSlotId && adSlotId !== '1234567890';
  const shouldUseTestAds = process.env.NODE_ENV !== 'production';
  useEffect(() => {
    if (!isConfigured) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Google AdSense 광고 단위(data-ad-slot)가 설정되지 않아 광고가 렌더링되지 않습니다.',
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
          Google AdSense 광고 단위(`NEXT_PUBLIC_ADSENSE_SLOT_ID`)가 비어 있어 테스트 광고도
          렌더링할 수 없습니다. 승인된 광고 단위를 환경 변수에 설정해 주세요.
        </div>
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

