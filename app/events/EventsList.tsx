'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type KeyboardEvent,
} from 'react';
import RegionFilter from './RegionFilter';
import MonthFilter from './MonthFilter';
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
  /**
   * URL 쿼리 파라미터와 사용자 입력을 읽어 필터 조건을 만든다.
   * - tag: 태그 탭
   * - region: 지역 드롭다운
   * - month: 월 선택 버튼
   * - past: 지난 대회 표시 여부
   * - query: 텍스트 검색어 (컴포넌트 내부 상태)
   */
  const searchParams = useSearchParams();
  const router = useRouter();
  const tag = searchParams.get('tag') || undefined;
  const region = searchParams.get('region') || undefined;
  const month = searchParams.get('month') || '';
  const showPast = searchParams.get('past') === '1';
  const [query, setQuery] = useState('');

  /**
   * 탭(태그) 목록은 이벤트에 등장한 태그를 기반으로 생성한다.
   * 첫 번째 항목은 전체 보기이며, 이후 항목은 알파벳 순으로 정렬한다.
   */
  const tabs: Omit<Tab, 'idx' | 'count'>[] = useMemo(
    () => [
      { key: undefined, label: '전체' },
      ...Array.from(new Set(events.flatMap(e => e.tags ?? [])))
        .sort()
        .map(key => ({ key, label: key })),
    ],
    [events],
  );

  const currentIndex = useMemo(
    () => Math.max(0, tabs.findIndex(t => t.key === tag)),
    [tabs, tag],
  );

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /** 오늘 날짜(시간은 00:00으로 고정)를 미리 계산해 재사용한다. */
  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);

  /**
   * 필터 파이프라인
   * 1) 지난 대회 숨기기 여부
   * 2) 지역 선택
   * 3) 월 선택
   * 4) 검색어 (월/텍스트 모두 지원)
   */
  const dateFiltered = useMemo(
    () =>
      showPast ? events : events.filter(e => new Date(e.date) >= today),
    [events, showPast, today],
  );

  const regionFiltered = useMemo(
    () => (region ? dateFiltered.filter(e => e.city === region) : dateFiltered),
    [dateFiltered, region],
  );

  const monthFiltered = useMemo(
    () =>
      month ? regionFiltered.filter(e => e.date.startsWith(month)) : regionFiltered,
    [month, regionFiltered],
  );

  const searchFiltered = useMemo(() => {
    if (!query) return monthFiltered;

    const trimmed = query.trim();
    const monthMatch = trimmed.match(/^(\d{1,2})월$/);

    if (monthMatch) {
      const target = monthMatch[1].padStart(2, '0');
      return monthFiltered.filter(e => e.date.slice(5, 7) === target);
    }

    const lowered = trimmed.toLowerCase();
    return monthFiltered.filter(e => e.title.toLowerCase().includes(lowered));
  }, [monthFiltered, query]);

  /**
   * 각 탭별로 필터 후 남는 개수를 계산하고, 탭 배열에 결합한다.
   * 이 정보는 뱃지 카운트와 키보드 내비게이션에 사용된다.
   */
  const tabsWithCounts: Tab[] = useMemo(() => {
    const counts = tabs.map(({ key }) =>
      key ? searchFiltered.filter(e => e.tags?.includes(key)).length : searchFiltered.length,
    );
    return tabs.map((t, idx) => ({ ...t, idx, count: counts[idx] }));
  }, [searchFiltered, tabs]);

  /** 기본으로 노출할 탭 수 (이후에는 더보기/접기 버튼으로 토글). */
  const SHOW_LIMIT = 6;
  const [showAllTabs, setShowAllTabs] = useState(currentIndex < SHOW_LIMIT - 1);

  useEffect(() => {
    if (currentIndex >= SHOW_LIMIT - 1) {
      setShowAllTabs(true);
    }
  }, [currentIndex]);

  const visibleTabs: Tab[] = useMemo(() => {
    if (showAllTabs) {
      return [...tabsWithCounts, { key: '__less', label: '접기', idx: -1 }];
    }
    if (tabsWithCounts.length > SHOW_LIMIT) {
      return [
        ...tabsWithCounts.slice(0, SHOW_LIMIT - 1),
        { key: '__more', label: '더보기', idx: -1 },
      ];
    }
    return tabsWithCounts;
  }, [showAllTabs, tabsWithCounts]);

  /** 탭 바 스크롤 버튼 활성화 여부를 계산한다. */
  const updateScrollButtons = useCallback(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  }, []);

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
  }, [updateScrollButtons]);

  const scrollTabs = useCallback((dir: number) => {
    tabsContainerRef.current?.scrollBy({
      left: dir * 120,
      behavior: 'smooth',
    });
  }, []);

  const items = useMemo(() => {
    const pool = tag ? searchFiltered.filter(e => e.tags?.includes(tag)) : searchFiltered;
    return [...pool].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  }, [searchFiltered, tag]);

  const updateSearchParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const queryString = params.toString();
      router.push(`${basePath}${queryString ? `?${queryString}` : ''}`);
    },
    [basePath, router, searchParams],
  );

  const togglePast = useCallback(
    (checked: boolean) => {
      updateSearchParam('past', checked ? '1' : undefined);
    },
    [updateSearchParam],
  );

  const selectTab = useCallback(
    (idx: number) => {
      const { key } = tabs[idx];
      updateSearchParam('tag', key);
    },
    [tabs, updateSearchParam],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

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
    },
    [selectTab, tabs],
  );

  return (
    <>
      {/* 필터 컨트롤 모음 */}
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
        <MonthFilter
          events={events}
          available={dateFiltered}
          basePath={basePath}
        />
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

      {/* 태그 탭 목록 */}
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

      {/* 대회 카드 목록 */}
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
              {(() => {
                const parsed = e.date ? new Date(e.date) : null;
                const isValid = parsed && !Number.isNaN(parsed.getTime());
                const dateLabel = isValid ? parsed.toLocaleDateString('ko-KR') : '일정 미정';
                return (
                  <span className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                      <path
                        d="M8 2v4M16 2v4M3 10h18M5 22h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    {dateLabel}
                  </span>
                );
              })()}
              <span className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                  <path
                    d="M8 2v4M16 2v4M3 10h18M5 22h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
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
