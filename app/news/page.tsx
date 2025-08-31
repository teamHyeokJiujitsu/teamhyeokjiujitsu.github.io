import Link from 'next/link';
import { getAllNewsMeta } from '@/lib/content';

export const metadata = { title: '뉴스 목록' };

export default function NewsListPage() {
  const items = getAllNewsMeta();
  return (
    <div>
      <h1>뉴스</h1>
      <div className="grid">
        {items.map(n => (
          <div key={n.slug} className="card">
            <h3 style={{ margin: '8px 0' }}>
              <Link href={`/news/${n.slug}/`}>{n.title}</Link>
            </h3>
            <div className="small">
              {new Date(n.date).toLocaleDateString('ko-KR')}
              {n.sourceName ? ` · ${n.sourceName}` : ''}
            </div>
            <div style={{ marginTop: 8 }}>{n.excerpt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
