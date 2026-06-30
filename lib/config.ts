/**
 * 사이트 전역 설정값.
 *
 * iOS App Store 링크 — 빌드타임 env(NEXT_PUBLIC_IOS_APP_STORE_URL)로 주입.
 * 정적 export(서버 런타임 없음)라 빌드 시점에 인라인된다.
 *
 * 비어 있으면 앱 다운로드 배너를 아예 렌더하지 않는다(휴면).
 * 앱이 App Store 심사 중이라 공개 링크가 없을 수 있으므로, 죽은 링크를 막기 위함.
 * 승인 후 NEXT_PUBLIC_IOS_APP_STORE_URL 을 채워서 재빌드/배포(CI)하면 켜진다.
 *   예) NEXT_PUBLIC_IOS_APP_STORE_URL=https://apps.apple.com/app/id0000000000
 */
export const IOS_APP_STORE_URL = process.env.NEXT_PUBLIC_IOS_APP_STORE_URL ?? '';
