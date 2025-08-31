'use client';

import type { EventMeta } from '@/lib/content';
import { eventToICS } from '@/lib/ics';

type Props = {
  meta: EventMeta;
};

export default function AddToCalendar({ meta }: Props) {
  const download = () => {
    const ics = eventToICS(meta);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.slug}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const start = new Date(meta.date);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
  const dates = `${fmt(start)}/${fmt(end)}`;
  const details = encodeURIComponent(meta.excerpt || '');
  const location = encodeURIComponent(
    [meta.venue, meta.city].filter(Boolean).join(', ')
  );
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    meta.title,
  )}&dates=${dates}&details=${details}&location=${location}`;

  return (
    <>
      <button type="button" className="btn btn-outline" onClick={download}>
        캘린더에 추가
      </button>
      <a
        className="btn btn-outline"
        href={gcalUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        구글 캘린더
      </a>
    </>
  );
}
