'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect, type KeyboardEvent } from 'react';
import RegionFilter from './RegionFilter';
import type { EventMeta } from '@/lib/content';

interface Tab {
  key: string | undefined;
  label: string;
  idx: number;
  count?: number;
}

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
  const [query, setQuery] = useState('');

  const tabs: Omit<Tab, 'idx' | 'count'>[] = [
    { key: undefined, label: '전체' },
    ...Array.from(new Set(events.flatMap(e => e.tags ?? [])))
      .sort()
      .map(key => ({ key, label: key })),
  ];

  const currentIndex = Math.max(
    0,
    tabs.findIndex(t => t.key === tag),
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateFiltered = showPast
    ? events
    : events.filter(e => new Date(e.date) >= today);

  const regionFiltered = region
    ? dateFiltered.filter(e => e.city === region)
    : dateFiltered;

  const searchFiltered = query
    ? regionFiltered.filter(e =>
        e.title.toLowerCase().includes(query.toLowerCase()),
      )
    : regionFiltered;

  const counts = tabs.map(({ key }) =>
    key
      ? searchFiltered.filter(e => e.tags?.includes(key)).length
      : searchFiltered.length,
  );
  const tabsWithCounts: Tab[] = tabs.map((t, idx) => ({
    ...t,
    idx,
    count: counts[idx],
  }));
  const SHOW_LIMIT = 6;
  const [showAllTabs, setShowAllTabs] = useState(currentIndex < SHOW_LIMIT - 1);
  useEffect(() => {
    if (currentIndex >= SHOW_LIMIT - 1) {
      setShowAllTabs(true);
    }
  }, [currentIndex]);
  const visibleTabs: Tab[] = showAllTabs
    ? [...tabsWithCounts, { key: '__less', label: '접기', idx: -1 }]
    : tabsWithCounts.length > SHOW_LIMIT
    ? [
        ...tabsWithCounts.slice(0, SHOW_LIMIT - 1),
        { key: '__more', label: '더보기', idx: -1 },
      ]
    : tabsWithCounts;

  const updateScrollButtons = () => {
    const el = tabsContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = tabsContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const scrollTabs = (dir: number) => {
    tabsContainerRef.current?.scrollBy({
      left: dir * 120,
      behavior: 'smooth',
    });
  };

  const items = tag
    ? searchFiltered.filter(e => e.tags?.includes(tag))
    : searchFiltered;

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
      <div className="filters">
        <input
          type="text"
          className="event-search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="대회 검색..."
          aria-label="대회 검색"
        />
        <RegionFilter events={dateFiltered} basePath={basePath} />
        <label className="past-toggle">
          <input
            type="checkbox"
            checked={showPast}
            onChange={e => togglePast(e.target.checked)}
          />
          <span className="switch" aria-hidden="true"></span>
          <span>날짜 지난 시합 일정도 보기</span>
        </label>
      </div>
      <div className="tabs-wrapper">
        <button
          className="tab-scroll left"
          onClick={() => scrollTabs(-1)}
          disabled={!canScrollLeft}
          aria-label="이전 탭"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="tabs" role="tablist" ref={tabsContainerRef}>
          {visibleTabs.map(({ key, label, idx, count }) => (
            key === '__more' || key === '__less' ? (
              <button
                key={key}
                className="tab"
                onClick={() => setShowAllTabs(key === '__more')}
              >
                {label}
              </button>
            ) : (
              <button
                key={key ?? 'all'}
                ref={el => {
                  if (idx >= 0) {
                    tabRefs.current[idx] = el;
                  }
                }}
                role="tab"
                aria-selected={idx === currentIndex}
                tabIndex={idx === currentIndex ? 0 : -1}
                className={`tab${idx === currentIndex ? ' active' : ''}`}
                onClick={() => selectTab(idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
              >
                {label}
                {typeof count === 'number' && (
                  <span className="tab-count">{count}</span>
                )}
              </button>
            )
          ))}
        </div>
        <button
          className="tab-scroll right"
          onClick={() => scrollTabs(1)}
          disabled={!canScrollRight}
          aria-label="다음 탭"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
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
            <div className="card-meta">
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
