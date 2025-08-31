'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, type KeyboardEvent } from 'react';
import RegionFilter from './RegionFilter';
import type { EventMeta } from '@/lib/content';

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
  const region = searchParams.get('region') || undefined;
  const showPast = searchParams.get('past') === '1';

  const tags = Array.from(
    new Set(events.flatMap(e => e.tags ?? [])),
  );
  const tabs = [
    { key: undefined, label: '전체' },
    ...tags.map(t => ({ key: t, label: t })),
  ];

  const currentIndex = Math.max(
    0,
    tabs.findIndex(t => t.key === tag),
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateFiltered = showPast
    ? events
    : events.filter(e => new Date(e.date) >= today);

  const regionFiltered = region
    ? dateFiltered.filter(e => e.city === region)
    : dateFiltered;

  const counts = tabs.map(({ key }) =>
    key
      ? regionFiltered.filter(e => e.tags?.includes(key)).length
      : regionFiltered.length,
  );

  const items = tag
    ? regionFiltered.filter(e => e.tags?.includes(tag))
    : regionFiltered;

  const togglePast = (checked: boolean) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (checked) {
      params.set('past', '1');
    } else {
      params.delete('past');
    }
    router.push(`${basePath}?${params.toString()}`);
  };

  const selectTab = (idx: number) => {
    const { key } = tabs[idx];
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (key) {
      params.set('tag', key);
    } else {
      params.delete('tag');
    }
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextIndex =
        e.key === 'ArrowRight'
          ? (idx + 1) % tabs.length
          : (idx - 1 + tabs.length) % tabs.length;
      const nextTab = tabRefs.current[nextIndex];
      if (nextTab) {
        nextTab.focus();
        selectTab(nextIndex);
      }
    }
  };

  return (
    <>
      <RegionFilter events={dateFiltered} basePath={basePath} />
      <div className="past-toggle">
        <label>
          <input
            type="checkbox"
            checked={showPast}
            onChange={e => togglePast(e.target.checked)}
          />
          날짜 지난 시합 일정도 보기
        </label>
      </div>
      <div className="tabs" role="tablist">
        {tabs.map(({ key, label }, idx) => (
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
          <Link
            key={e.slug}
            href={`/events/${e.slug}/`}
            className="card animated-card"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <h3 className="card-title">{e.title}</h3>
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
          </Link>
        ))}
      </div>
    </>
  );
}
