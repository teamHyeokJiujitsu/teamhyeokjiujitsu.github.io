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
          </button>
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
