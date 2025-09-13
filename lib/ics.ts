import type { EventMeta } from './content';

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function formatDateTime(d: Date) {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escape(text: string) {
  return text.replace(/\\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export function eventToICS(meta: EventMeta): string {
  const start = new Date(meta.date);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//teamhyeokjiujitsu.github.io//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${meta.slug}@teamhyeokjiujitsu.github.io`,
    `DTSTAMP:${formatDateTime(new Date())}`,
    `DTSTART;VALUE=DATE:${formatDate(start)}`,
    `DTEND;VALUE=DATE:${formatDate(end)}`,
    `SUMMARY:${escape(meta.title)}`,
    meta.excerpt ? `DESCRIPTION:${escape(meta.excerpt)}` : '',
    meta.city || meta.venue
      ? `LOCATION:${escape([meta.venue, meta.city].filter(Boolean).join(', '))}`
      : '',
    meta.registrationUrl ? `URL:${meta.registrationUrl}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.filter(Boolean).join('\r\n');
}
