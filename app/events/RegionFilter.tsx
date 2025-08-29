'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
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

  const regions = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      if (e.city) set.add(e.city);
    });
    return Array.from(set).sort();
  }, [events]);

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

  return (
    <div className="region-filter">
      <select
        aria-label="지역 선택"
        value={region}
        onChange={e => updateRegion(e.target.value)}
      >
        <option value="">전체 지역</option>
        {regions.map(r => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {region && (
        <div className="selected-region">
          <span className="badge">
            {region}
            <button
              type="button"
              aria-label="지역 제거"
              onClick={() => updateRegion('')}
              className="ml-1"
            >
              ×
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

