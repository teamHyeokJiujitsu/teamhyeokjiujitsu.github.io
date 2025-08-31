import { Suspense } from 'react';
import Link from 'next/link';
import { getAllEventsMeta } from '@/lib/content';
import EventsList from './events/EventsList';
import EventsListSkeleton from './events/EventsListSkeleton';

export const metadata = { title: '대회 목록' };

export default function Page() {
  const events = getAllEventsMeta();
  return (
    <div>
      <section className="hero">
        <span className="hero-orb orb1" />
        <span className="hero-orb orb2" />
        <span className="hero-orb orb3" />
        <h1 className="home-title hero-title">주짓수 대회 일정</h1>
        <p className="home-intro hero-intro">
          국내 주짓수 대회를 한 번에 확인하세요.
        </p>
        <div className="actions">
          <Link href="#events" className="btn btn-primary">
            대회 보기
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
