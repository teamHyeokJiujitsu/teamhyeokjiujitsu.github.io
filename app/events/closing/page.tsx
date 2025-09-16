import Link from 'next/link';
import { getAllEventsMeta } from '@/lib/content';

export const metadata = { title: '얼마 남지 않은 대회 일정' };

export default function ClosingEventsPage() {
  const items = getAllEventsMeta();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const soon = new Date(today);
  soon.setDate(today.getDate() + 14);
  // 2주 이내에 열리는 이벤트만 추려낸다.
  const closingEvents = items
    .filter(event => {
      const date = new Date(event.date);
      return date >= today && date <= soon;
    })
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  return (
    <div>
      <h1>얼마 남지 않은 대회 일정</h1>
      {closingEvents.length === 0 ? (
        <p>현재 곧 개최되는 대회가 없습니다.</p>
      ) : (
        <div className="grid">
          {closingEvents.map(event => (
            <div key={event.slug} className="card">
              <h3 style={{ margin: '8px 0' }}>
                <Link href={`/events/${event.slug}/`}>{event.title}</Link>
              </h3>
              <div className="small">
                {new Date(event.date).toLocaleDateString('ko-KR')}
                {event.city ? ` · ${event.city}` : ''}
                {event.venue ? ` · ${event.venue}` : ''}
              </div>
              <div style={{ marginTop: 8 }}>{event.excerpt}</div>
              {event.registrationUrl ? (
                <div style={{ marginTop: 8 }}>
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    접수 링크 바로가기
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
