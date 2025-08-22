import Link from 'next/link';
import { getAllEventsMeta } from '@/lib/content';

export const metadata = { title: '대회 목록' };

export default function EventsListPage() {
  const items = getAllEventsMeta();
  return (
    <div>
      <h1>대회</h1>
      <div className="grid">
        {items.map(e => (
          <div key={e.slug} className="card">
            <h3 style={{ margin: '8px 0' }}>
              <Link href={`/events/${e.slug}/`}>{e.title}</Link>
            </h3>
            <div className="small">
              {new Date(e.date).toLocaleDateString('ko-KR')} · {e.city} {e.venue ? `· ${e.venue}` : ''}
            </div>
            <div style={{ marginTop: 8 }}>{e.excerpt}</div>
            {e.registrationUrl ? (
              <div style={{ marginTop: 8 }}>
                <a href={e.registrationUrl} target="_blank">접수 링크 바로가기</a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}