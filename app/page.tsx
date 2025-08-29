import { Suspense } from 'react';
import { getAllEventsMeta } from '@/lib/content';
import EventsList from './events/EventsList';

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
        <p className="home-intro small hero-intro">
          국내 주짓수 대회를 한 번에 확인하세요.
        </p>
      </section>
      <Suspense>
        <EventsList events={events} />
      </Suspense>
    </div>
  );
}
