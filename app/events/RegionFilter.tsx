'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import type { EventMeta } from '@/lib/content';

export default function RegionFilter({
  events,
  basePath = '/',
}: {
  events: EventMeta[];
  basePath?: string;
}) {
  /** 드롭다운 열림 여부 및 검색/최근 상태를 관리한다. */
  const router = useRouter();
  const searchParams = useSearchParams();
  const region = searchParams.get('region') || '';
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [focused, setFocused] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentRegions');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed)) {
        setRecent(parsed.filter((item): item is string => typeof item === 'string'));
      }
    } catch (error) {
      console.warn('최근 지역 정보를 불러오지 못했습니다.', error);
    }
  }, []);

  // 드롭다운 밖을 클릭하면 닫는다.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const regions = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      if (e.city) set.add(e.city);
    });
    return Array.from(set).sort();
  }, [events]);

  /** 검색어가 적용된 지역 목록과 최근 선택 항목을 합친다. */
  const filtered = useMemo(
    () => regions.filter(r => r.toLowerCase().includes(search.toLowerCase())),
    [regions, search],
  );
  const options = useMemo(
    () => [...recent, ...filtered],
    [filtered, recent],
  );
  const updateRegion = useCallback(
    (value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) {
        params.set('region', value);
      } else {
        params.delete('region');
      }
      const query = params.toString();
      router.push(`${basePath}${query ? `?${query}` : ''}`);
    },
    [basePath, router, searchParams],
  );

  const selectRegion = useCallback(
    (value: string) => {
      updateRegion(value);
      setOpen(false);
      if (value) {
        setRecent(prev => {
          const next = [value, ...prev.filter(r => r !== value)].slice(0, 5);
          localStorage.setItem('recentRegions', JSON.stringify(next));
          return next;
        });
      }
    },
    [updateRegion],
  );

  // 키보드 내비게이션 및 단축키 처리.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (!open) return;
      if (!options.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocused(f => (f + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocused(f => (f - 1 + options.length) % options.length);
      } else if (e.key === 'Enter') {
        if (focused >= 0 && options[focused]) {
          e.preventDefault();
          selectRegion(options[focused]);
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, options, focused, selectRegion]);

  // 포커스된 옵션을 DOM에 반영한다.
  useEffect(() => {
    if (focused >= 0) {
      optionsRef.current[focused]?.focus();
    }
  }, [focused]);

  // 드롭다운이 닫히면 포커스 상태를 초기화한다.
  useEffect(() => {
    if (!open) setFocused(-1);
  }, [open]);

  // 다음 렌더링에서 새로 채우기 위해 참조 배열을 초기화한다.
  optionsRef.current = [];
  return (
    <div className="region-filter" ref={ref}>
      <button
        type="button"
        className="region-button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
        <span>{region || '지역 선택'}</span>
      </button>
      {open && (
        <div className="region-dropdown" role="listbox">
          <input
            type="text"
            className="region-search"
            placeholder="지역 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {recent.length > 0 && (
            <>
              <div className="dropdown-section-title">최근 선택</div>
              <div className="region-options">
                {recent.map((r, i) => (
                  <button
                    key={`recent-${r}`}
                    className="region-option"
                    onClick={() => selectRegion(r)}
                    role="option"
                    aria-selected={region === r}
                    ref={el => {
                      optionsRef.current[i] = el!;
                    }}
                    tabIndex={-1}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="dropdown-section-title">전체 지역</div>
          <div className="region-options">
            {filtered.map((r, i) => (
              <button
                key={r}
                className="region-option"
                onClick={() => selectRegion(r)}
                role="option"
                aria-selected={region === r}
                ref={el => {
                  optionsRef.current[recent.length + i] = el!;
                }}
                tabIndex={-1}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
      {region && (
        <div className="selected-region">
          <span className="badge">
            {region}
            <button
              type="button"
              aria-label="지역 제거"
              onClick={() => selectRegion('')}
            >
              ×
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

