'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { EventMeta } from '@/lib/content';

const TABS = [
  { key: undefined, label: '전체' },
  { key: 'kbjjf', label: 'KBJJF' },
  { key: 'street', label: '스트릿 주짓수' },
  { key: 'jagers', label: '예거스' },
];

export default function EventsList({
  events,
  basePath = '/',
}: {
  events: EventMeta[];
  basePath?: string;
}) {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag') || undefined;
  const filtered = tag ? events.filter(e => e.tags?.includes(tag)) : events;
  const items = filtered;

  return (
    <>
      <div className="tabs">
        {TABS.map(({ key, label }) => (
          <Link
            key={key ?? 'all'}
            href={key ? `${basePath}?tag=${key}` : basePath}
            className={`tab${key === tag ? ' active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="grid">
        {items.map(e => (
          <div key={e.slug} className="card">
            <h3 className="card-title">
              <Link href={`/events/${e.slug}/`}>{e.title}</Link>
            </h3>
            <div className="card-meta small">
              {new Date(e.date).toLocaleDateString('ko-KR')}
              {e.city ? ` · ${e.city}` : ''}
              {e.venue ? ` · ${e.venue}` : ''}
            </div>
            <div className="card-excerpt">{e.excerpt}</div>
            <div className="card-tags">
              {e.tags?.map(t => (
                <span key={t} className="badge">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
