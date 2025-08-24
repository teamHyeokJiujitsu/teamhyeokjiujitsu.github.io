import { Suspense } from 'react';
import { getAllEventsMeta } from '@/lib/content';
import EventsList from './events/EventsList';

export const metadata = { title: '대회 목록' };

export default function Page() {
  const events = getAllEventsMeta();
  return (
    <div>
      <h1 className="home-title">주짓수 대회 일정</h1>
      <p className="home-intro small">국내 주짓수 대회를 한 번에 확인하세요.</p>
      <Suspense>
        <EventsList events={events} />
      </Suspense>
    </div>
  );
}
