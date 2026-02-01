'use client';

import { useEffect, useMemo, useState } from 'react';

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? '';
const ADSENSE_SLOT_ID = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? '';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSenseBanner() {
  const [hasLoaded, setHasLoaded] = useState(false);

  const config = useMemo(() => {
    const client = ADSENSE_CLIENT_ID.trim();
    const slot = ADSENSE_SLOT_ID.trim();
    return {
      client,
      slot,
      isReady: client.length > 0 && slot.length > 0,
    };
  }, []);

  useEffect(() => {
    if (!config.isReady) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
      setHasLoaded(true);
    } catch (error) {
      console.warn('AdSense failed to load.', error);
    }
  }, [config.isReady]);

  if (!config.isReady) {
    return (
      <div className="ad-banner ad-banner--warning" role="status" aria-live="polite">
        <span className="badge badge--warning">AdSense 설정 필요</span>
        <strong>광고 유닛 정보를 입력해야 합니다.</strong>
        <ul className="ad-banner__list">
          <li>NEXT_PUBLIC_ADSENSE_CLIENT_ID</li>
          <li>NEXT_PUBLIC_ADSENSE_SLOT_ID</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="adsense-banner" aria-live="polite">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={config.client}
        data-ad-slot={config.slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {!hasLoaded && <span className="adsense-banner__loading">광고 로딩 중...</span>}
    </div>
  );
}
