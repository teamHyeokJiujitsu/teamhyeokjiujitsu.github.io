import { Suspense } from 'react';
import { getAllEventsMeta } from '@/lib/content';
import EventsList from './events/EventsList';

export const metadata = { title: '대회 목록' };

export default function HomePage() {
  const events = getAllEventsMeta();
  return (
    <div>
      <h1>대회</h1>
      <Suspense>
        <EventsList events={events} basePath="/" />
      </Suspense>
    </div>
  );
}
