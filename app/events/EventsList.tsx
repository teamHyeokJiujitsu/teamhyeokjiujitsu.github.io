'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, type KeyboardEvent } from 'react';
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
  const router = useRouter();
  const tag = searchParams.get('tag') || undefined;
  const currentIndex = Math.max(
    0,
    TABS.findIndex(t => t.key === tag),
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const filtered = tag ? events.filter(e => e.tags?.includes(tag)) : events;
  const items = filtered;
  const counts = TABS.map(({ key }) =>
    key ? events.filter(e => e.tags?.includes(key)).length : events.length,
  );

  const selectTab = (idx: number) => {
    const { key } = TABS[idx];
    router.push(key ? `${basePath}?tag=${key}` : basePath);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextIndex =
        e.key === 'ArrowRight'
          ? (idx + 1) % TABS.length
          : (idx - 1 + TABS.length) % TABS.length;
      tabRefs.current[nextIndex]?.focus();
      selectTab(nextIndex);
    }
  };

  return (
    <>
      <div className="tabs" role="tablist">
        {TABS.map(({ key, label }, idx) => (
          <button
            key={key ?? 'all'}
            ref={el => {
              tabRefs.current[idx] = el;
            }}
            role="tab"
            aria-selected={idx === currentIndex}
            tabIndex={idx === currentIndex ? 0 : -1}
            className={`tab${idx === currentIndex ? ' active' : ''}`}
            onClick={() => selectTab(idx)}
            onKeyDown={e => handleKeyDown(e, idx)}
          >
            {label}
            <span className="tab-count">{counts[idx]}</span>
          </button>
        ))}
      </div>
      <div className="grid">
        {items.map((e, idx) => (
          <div
            key={e.slug}
            className="card animated-card"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <h3 className="card-title">
              <Link href={`/events/${e.slug}/`}>{e.title}</Link>
            </h3>
            <div className="card-meta small">
              <span className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                  <path
                    d="M8 2v4M16 2v4M3 10h18M5 22h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                {new Date(e.date).toLocaleDateString('ko-KR')}
              </span>
              {e.city && (
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                    <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
                    <circle cx="12" cy="11" r="2" />
                  </svg>
                  {e.city}
                </span>
              )}
              {e.venue && (
                <span className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-4v-5H9v5H5a2 2 0 01-2-2z" />
                  </svg>
                  {e.venue}
                </span>
              )}
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
