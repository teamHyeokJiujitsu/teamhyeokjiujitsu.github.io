import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="status-page">
      <p className="status-page__code">404</p>
      <h1 className="status-page__title">페이지를 찾을 수 없어요</h1>
      <p className="status-page__desc">
        주소가 바뀌었거나 더 이상 존재하지 않는 대회 페이지일 수 있어요.
      </p>
      <div className="status-page__actions">
        <Link href="/" className="btn btn-primary">
          대회 일정 보러가기
        </Link>
        <Link href="/events/closing" className="btn btn-outline">
          마감 임박 대회
        </Link>
      </div>
    </div>
  );
}
