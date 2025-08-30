'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useRef, useEffect } from 'react';
import type { EventMeta } from '@/lib/content';

export default function RegionFilter({
  events,
  basePath = '/',
}: {
  events: EventMeta[];
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const region = searchParams.get('region') || '';
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('recentRegions');
    if (stored) setRecent(JSON.parse(stored));
  }, []);

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

  const filtered = useMemo(
    () => regions.filter(r => r.includes(search)),
    [regions, search],
  );
  const updateRegion = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set('region', value);
    } else {
      params.delete('region');
    }
    const query = params.toString();
    router.push(`${basePath}${query ? `?${query}` : ''}`);
  };

  const selectRegion = (value: string) => {
    updateRegion(value);
    setOpen(false);
    if (value) {
      setRecent(prev => {
        const next = [value, ...prev.filter(r => r !== value)].slice(0, 5);
        localStorage.setItem('recentRegions', JSON.stringify(next));
        return next;
      });
    }
  };

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
                {recent.map(r => (
                  <button
                    key={`recent-${r}`}
                    className="region-option"
                    onClick={() => selectRegion(r)}
                    role="option"
                    aria-selected={region === r}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="dropdown-section-title">전체 지역</div>
          <div className="region-options">
            {filtered.map(r => (
              <button
                key={r}
                className="region-option"
                onClick={() => selectRegion(r)}
                role="option"
                aria-selected={region === r}
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

