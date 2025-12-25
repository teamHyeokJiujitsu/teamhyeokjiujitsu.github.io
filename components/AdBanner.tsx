'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    PartnersCoupang?: {
      G: (options: {
        id: number;
        template: string;
        trackingCode: string;
        width: string;
        height: string;
        subId: string | null;
        newWindow: boolean;
      }) => void;
    };
  }
}

const COUPANG_TRACKING_CODE = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID ?? 'AF8593380';
const COUPANG_TEMPLATE_ID = Number.parseInt(process.env.NEXT_PUBLIC_COUPANG_TEMPLATE_ID ?? '784777', 10);
const TEMPLATE_ID = Number.isFinite(COUPANG_TEMPLATE_ID) ? COUPANG_TEMPLATE_ID : 784777;

export default function AdBanner() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'ready' | 'error'>('idle');

  useEffect(() => {
    let cancelled = false;

    const ensureScript = () =>
      new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[data-coupang-partners]');
        if (existing) {
          if (window.PartnersCoupang?.G) {
            resolve();
            return;
          }
          if (existing.readyState === 'complete') {
            resolve();
            return;
          }
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('Coupang script failed to load')));
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://ads-partners.coupang.com/g.js';
        script.async = true;
        script.dataset.coupangPartners = 'true';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Coupang script failed to load'));
        document.head.appendChild(script);
      });

    const renderAd = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';

      if (!window.PartnersCoupang?.G) {
        throw new Error('Coupang widget is unavailable');
      }

      const inlineScript = document.createElement('script');
      inlineScript.type = 'text/javascript';
      inlineScript.innerHTML = `
        new PartnersCoupang.G({
          id: ${TEMPLATE_ID},
          template: "carousel",
          trackingCode: "${COUPANG_TRACKING_CODE}",
          width: "100%",
          height: "140",
          subId: null,
          newWindow: true
        });
      `;

      containerRef.current.appendChild(inlineScript);
      setStatus('ready');
    };

    ensureScript()
      .then(() => {
        if (cancelled) return;
        renderAd();
      })
      .catch(err => {
        console.error('[Coupang Partners]', err);
        if (!cancelled) {
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  if (status === 'error') {
    return (
      <div className="ad-banner ad-banner--warning">
        <div className="badge badge--warning">광고 로드 실패</div>
        <div className="small">
          쿠팡 파트너스 스크립트를 불러오지 못했습니다. 네트워크 상태나 광고 차단 설정을 확인해 주세요.
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="ad-banner" aria-live="polite" />;
}
