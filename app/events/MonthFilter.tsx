'use client';

import { useMemo } from 'react';
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

  /** 전체 이벤트에서 월 단위 타임라인을 생성한다. */
  const months = useMemo(() => {
    if (events.length === 0) return [];
    const validMonths = events
      .map(e => e.date?.slice(0, 7) ?? '')
      .filter(m => /^\d{4}-\d{2}$/.test(m))
      .sort();
    if (validMonths.length === 0) return [];

    const start = validMonths[0];
    const end = validMonths[validMonths.length - 1];
    const [startY, startM] = start.split('-').map(Number);
    const [endY, endM] = end.split('-').map(Number);
    const result: string[] = [];
    let y = startY;
    let m = startM;
    while (y < endY || (y === endY && m <= endM)) {
      result.push(`${y}-${String(m).padStart(2, '0')}`);
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
    return result;
  }, [events]);

  /** 월 버튼을 클릭했을 때 URL 쿼리 파라미터를 갱신한다. */
  const changeMonth = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      params.set('month', value);
    } else {
      params.delete('month');
    }
    const query = params.toString();
    router.push(`${basePath}${query ? `?${query}` : ''}`);
  };

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
        const disabled = !available.some(e => e.date.startsWith(m));
        return (
          <button
            key={m}
            type="button"
            className={`month-option${selected === m ? ' active' : ''}`}
            onClick={() => changeMonth(m)}
            disabled={disabled}
          >
            {formatMonth(m)}
          </button>
        );
      })}
    </div>
  );
}
