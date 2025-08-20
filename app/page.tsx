import Link from 'next/link';
import Image from 'next/image';
import { getAllNewsMeta, getAllEventsMeta } from '@/lib/content';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function HomePage() {
  const news = getAllNewsMeta().slice(0, 6);
  const events = getAllEventsMeta().slice(0, 6);

  return (
    <div>
      <h1>주짓수 소식 & 대회 정보</h1>

      <h2 style={{ marginTop: 24 }}>최근 뉴스</h2>
      <div className="grid">
        {news.map(n => (
          <div key={n.slug} className="card">
            {n.cover ? <Image src={`${BASE_PATH}${n.cover}`} alt="" width={640} height={360} /> : null}
            <h3 style={{ margin: '8px 0' }}><Link href={`/news/${n.slug}/`}>{n.title}</Link></h3>
            <div className="small">{new Date(n.date).toLocaleDateString('ko-KR')}</div>
            <div style={{ marginTop: 8 }}>{n.excerpt}</div>
            <div style={{ marginTop: 8 }}>
              {n.tags?.map(t => <span key={t} className="badge">{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 24 }}>임박한 대회</h2>
      <div className="grid">
        {events.map(e => (
          <div key={e.slug} className="card">
            {e.cover ? <Image src={`${BASE_PATH}${e.cover}`} alt="" width={640} height={360} /> : null}
            <h3 style={{ margin: '8px 0' }}><Link href={`/events/${e.slug}/`}>{e.title}</Link></h3>
            <div className="small">
              {new Date(e.date).toLocaleDateString('ko-KR')} · {e.city} {e.venue ? `· ${e.venue}` : ''}
            </div>
            <div style={{ marginTop: 8 }}>{e.excerpt}</div>
            <div style={{ marginTop: 8 }}>
              {e.tags?.map(t => <span key={t} className="badge">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
