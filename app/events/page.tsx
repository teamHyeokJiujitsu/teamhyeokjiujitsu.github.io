import Link from 'next/link';
import { getAllEventsMeta } from '@/lib/content';

export default function HomePage() {
  const events = getAllEventsMeta().slice(0, 10); // 최근 10개만
  return (
    <div>
      <h1>주짓수 대회 일정</h1>
      <div className="grid">
        {events.map(e => (
          <div key={e.slug} className="card">
            <h3 style={{ margin: '8px 0' }}>
              <Link href={`/events/${e.slug}/`}>{e.title}</Link>
            </h3>
            <div className="small">
              {new Date(e.date).toLocaleDateString('ko-KR')}
              {e.city ? ` · ${e.city}` : ''}{e.venue ? ` · ${e.venue}` : ''}
            </div>
            <div style={{ marginTop: 8 }}>{e.excerpt}</div>
            <div style={{ marginTop: 8 }}>
              {e.tags?.map(t => <span key={t} className="badge">{t}</span>)}
            </div>
            {e.registrationUrl ? (
              <div style={{ marginTop: 8 }}>
                <a href={e.registrationUrl} target="_blank">접수 링크</a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
