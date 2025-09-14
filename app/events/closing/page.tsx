import Link from 'next/link';
import { getAllEventsMeta } from '@/lib/content';

export const metadata = { title: '얼마 남지 않은 대회 일정' };

export default function ClosingEventsPage() {
  const items = getAllEventsMeta();
  const today = new Date();
  today.setHours(0,0,0,0);
  const soon = new Date(today);
  soon.setDate(today.getDate() + 14);
  const closing = items
    .filter(e => {
      const d = new Date(e.date);
      return d >= today && d <= soon;
    })
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h1>얼마 남지 않은 대회 일정</h1>
      {closing.length === 0 ? (
        <p>현재 곧 개최되는 대회가 없습니다.</p>
      ) : (
        <div className="grid">
          {closing.map(e => (
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
                  <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer">
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
