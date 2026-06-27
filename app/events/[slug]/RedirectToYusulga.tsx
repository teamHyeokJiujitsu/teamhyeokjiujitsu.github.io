'use client';

import { useEffect } from 'react';

/**
 * 유술가들 상세로 보내는 게이트웨이 리다이렉트.
 *
 * <meta http-equiv="refresh"> 는 "전체 페이지 로드"(직접 진입·구글 색인·외부 링크)에서만
 * 확실히 동작한다. 반면 옛 캐시가 남은 폰이 SPA 클라이언트 내비게이션으로 이 라우트에
 * 들어오면 meta refresh 도, 인라인 <script> 도 실행되지 않아 리다이렉트가 누락되고
 * 일부 모바일 브라우저에서 다운로드처럼 처리되는 문제가 있었다.
 *
 * useEffect 는 최초 마운트와 클라이언트 내비게이션 양쪽에서 모두 실행되므로,
 * 어느 경로로 들어오든 유술가들로 이동을 보장한다.
 */
export default function RedirectToYusulga({ target }: { target: string }) {
  useEffect(() => {
    window.location.replace(target);
  }, [target]);
  return null;
}
