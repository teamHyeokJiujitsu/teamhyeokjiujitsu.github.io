import { Suspense } from 'react';
import { getAllEventsMeta } from '@/lib/content';
import EventsList from './EventsList';

export default function EventsPage() {
  const events = getAllEventsMeta();
  return (
    <div>
      <h1>주짓수 대회 일정</h1>
      <Suspense>
        <EventsList events={events} />
      </Suspense>
    </div>
  );
}
