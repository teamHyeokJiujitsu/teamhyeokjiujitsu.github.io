'use client';

import { useEffect, useState } from 'react';
import { IOS_APP_STORE_URL } from '@/lib/config';

/**
 * iOS 웹 방문자 → '유술가들' App Store 다운로드 유도 배너.
 * 본사이트(yusulga.com)의 app-promo 와 1:1 동작 일치.
 *
 * 노출 조건(모두 충족):
 *   1) App Store URL 설정됨(빈 문자열 아님)
 *   2) iOS 기기 (iPhone/iPad/iPod, iPadOS13+ 위장 보강)
 *   3) 유술가들 앱 WebView 아님 (UA 에 'YusulgaApp' 없음)
 *   4) 최근에 닫지 않음 (localStorage 'ya_appbanner_until' 가 미래면 숨김)
 *   5) 데스크톱(≥768px)은 CSS 로도 숨김 — iOS 모바일 타겟
 *
 * SSR/hydration mismatch 회피: 서버 렌더 땐 visible=false → null, mount 후 useEffect 에서 판정.
 */

const SNOOZE_KEY = 'ya_appbanner_until';
const DAY_MS = 864e5;

export default function AppDownloadBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!IOS_APP_STORE_URL) return; // (1) 휴면
    const ua = navigator.userAgent || '';
    // (2) iPadOS 13+ 는 Macintosh 로 위장 → 터치 지원으로 보강
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
    const inApp = ua.indexOf('YusulgaApp') !== -1; // (3)
    if (!isIOS || inApp) return;
    // (4) 스누즈 기간 내면 숨김
    let until = 0;
    try { until = parseInt(localStorage.getItem(SNOOZE_KEY) || '0', 10); } catch {}
    if (until && Date.now() < until) return;
    setVisible(true);
  }, []);

  // 노출 동안 body 표식 → 쿠팡 광고 카드(.coupang-card)를 위로 밀어 겹침 방지
  useEffect(() => {
    if (!visible) return;
    document.body.classList.add('has-app-banner');
    return () => document.body.classList.remove('has-app-banner');
  }, [visible]);

  if (!IOS_APP_STORE_URL || !visible) return null;

  const snooze = (days: number) => {
    try { localStorage.setItem(SNOOZE_KEY, String(Date.now() + days * DAY_MS)); } catch {}
  };

  return (
    <div className="ya-appbanner">
      <div className="ya-appbanner__in">
        <div className="ya-appbanner__icon" aria-hidden="true">🥋</div>
        <div className="ya-appbanner__txt">
          <strong>유술가들 앱</strong>
          <span>대회 일정 알림을 푸시로 받아보세요</span>
        </div>
        <a
          className="ya-appbanner__cta"
          href={IOS_APP_STORE_URL}
          rel="noopener"
          onClick={() => snooze(60)}
        >
          받기
        </a>
        <button
          type="button"
          className="ya-appbanner__x"
          aria-label="닫기"
          onClick={() => { setVisible(false); snooze(14); }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
