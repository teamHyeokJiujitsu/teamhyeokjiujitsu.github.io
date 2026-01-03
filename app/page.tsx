import { Suspense } from 'react';
import Link from 'next/link';
import { getAllEventsMeta } from '@/lib/content';
import EventsList from './events/EventsList';
import EventsListSkeleton from './events/EventsListSkeleton';

export const metadata = {
  title: '2026 주짓수 대회 일정 | 서울·부산·전국 | 신청 링크 포함',
  description:
    '주짓수 대회 일정 (2025~2026) 한눈에 보기. 서울·부산 등 지역별 일정, 노기/기 종목, ADCC KOREA 일정, 접수 링크와 신청 방법까지 정리했습니다.',
};

export default function Page() {
  const events = getAllEventsMeta();
  return (
    <div>
      <section className="hero">
        <span className="hero-orb orb1" />
        <span className="hero-orb orb2" />
        <span className="hero-orb orb3" />
        <h1 className="home-title hero-title">주짓수 대회 일정 (2025~2026)</h1>
        <p className="home-intro hero-intro">
          국내 주짓수 대회를 한 번에 확인하세요.
        </p>
        <p className="home-intro" style={{ marginTop: 8 }}>
          <strong>최종 업데이트: 2026-01-15</strong>
        </p>
        <div className="actions">
          <Link href="#events" className="btn btn-primary">
            대회 보기
          </Link>
          <Link href="/events/closing" className="btn btn-urgent">
            얼마 남지 않은 대회
          </Link>
        </div>
      </section>
      <section id="events">
        <Suspense fallback={<EventsListSkeleton />}>
          <EventsList events={events} />
        </Suspense>
      </section>
    </div>
  );
}
