'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { EventMeta } from '@/lib/content';

interface Props {
  events: EventMeta[];
  available: EventMeta[];
  basePath?: string;
}

export default function MonthFilter({ events, available, basePath = '/' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get('month') || '';

  /** 실제 일정이 존재하는 월만 추려낸다. */
  const months = useMemo(() => {
    const source = available.length > 0 ? available : events;
    if (source.length === 0) return [];
    const validMonths = source
      .map(e => e.date?.slice(0, 7) ?? '')
      .filter(m => /^\d{4}-\d{2}$/.test(m));
    return Array.from(new Set(validMonths)).sort();
  }, [available, events]);

  /** 월 버튼을 클릭했을 때 URL 쿼리 파라미터를 갱신한다. */
  const changeMonth = useCallback((value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set('month', value);
    } else {
      params.delete('month');
    }
    const query = params.toString();
    router.push(`${basePath}${query ? `?${query}` : ''}`);
  }, [basePath, router, searchParams]);

  useEffect(() => {
    if (selected && !months.includes(selected)) {
      changeMonth('');
    }
  }, [changeMonth, months, selected]);

  const formatMonth = (value: string) => {
    const [year, month] = value.split('-');
    return `${year}년 ${Number(month)}월`;
  };

  return (
    <div className="month-filter">
      <button
        type="button"
        className={`month-option${selected === '' ? ' active' : ''}`}
        onClick={() => changeMonth('')}
      >
        전체
      </button>
      {months.map(m => {
        return (
          <button
            key={m}
            type="button"
            className={`month-option${selected === m ? ' active' : ''}`}
            onClick={() => changeMonth(m)}
          >
            {formatMonth(m)}
          </button>
        );
      })}
    </div>
  );
}
