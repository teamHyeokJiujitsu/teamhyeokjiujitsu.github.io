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
      <section className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 12 }}>주요 키워드로 빠르게 찾기</h2>
        <p style={{ marginBottom: 8 }}>
          2026년까지 예정된 <strong>주짓수 대회 일정 2026</strong>과 서울에서 열리는{' '}
          <strong>서울 주짓수 대회</strong>, 도복 없이 진행되는 <strong>노기 대회 일정</strong>을
          최신 정보로 정리하고 있습니다.
        </p>
        <p>
          국내·국제 무대를 아우르는 <strong>ADCC KOREA 일정</strong>과 단계별로 따라 할 수 있는{' '}
          <strong>주짓수 대회 신청 방법</strong> 안내도 제공하니, 원하는 대회를 바로 찾아보세요.
        </p>
      </section>
      <section id="events">
        <Suspense fallback={<EventsListSkeleton />}>
          <EventsList events={events} />
        </Suspense>
      </section>
    </div>
  );
}
