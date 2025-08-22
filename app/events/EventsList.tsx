'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { EventMeta } from '@/lib/content';

const TABS = [
  { key: undefined, label: '전체' },
  { key: 'street', label: '스트릿 주짓수' },
  { key: 'yaegers', label: '예거스컵' },
  { key: 'heroes', label: '히어로즈 리그' },
  { key: 'pbjjf', label: 'PBJJF' },
  { key: 'kbjjf', label: 'KBJJF' },
  { key: 'street', label: '스트릿 주짓수' },
  { key: 'yaegers', label: '예거스' },
];

export default function EventsList({ events }: { events: EventMeta[] }) {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag') || undefined;
  const filtered = tag ? events.filter(e => e.tags?.includes(tag)) : events;
  const items = filtered.slice(0, 10); // 최근 10개만

  return (
    <>
      <div className="tabs">
        {TABS.map(({ key, label }) => (
          <Link
            key={key ?? 'all'}
            href={key ? `/events/?tag=${key}` : '/events/'}
            className={`tab${key === tag ? ' active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="grid">
        {items.map(e => (
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
              {e.tags?.map(t => (
                <span key={t} className="badge">
                  {t}
                </span>
              ))}
            </div>
            {e.registrationUrl ? (
              <div style={{ marginTop: 8 }}>
                <a href={e.registrationUrl} target="_blank">
                  접수 링크
                </a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
