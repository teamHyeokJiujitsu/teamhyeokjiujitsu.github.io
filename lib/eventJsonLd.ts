import type { EventMeta } from './content';

export function buildEventJsonLd(meta: EventMeta, slug: string) {
  const parsedDate = meta.date ? new Date(meta.date) : null;
  const isValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
  const eventUrl = `https://jiujitsu.teamhyeok.com/events/${slug}/`;

  const location =
    meta.city || meta.venue
      ? {
          '@type': 'Place',
          name: meta.venue || meta.city,
          address: {
            '@type': 'PostalAddress',
            addressLocality: meta.city || undefined,
            addressCountry: 'KR',
          },
        }
      : {
          '@type': 'Place',
          name: '대한민국',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'KR',
          },
        };

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: meta.title,
    startDate: isValidDate ? meta.date : undefined,
    description: meta.excerpt || undefined,
    image: meta.cover || undefined,
    url: eventUrl,
    organizer: meta.organizer
      ? { '@type': 'Organization', name: meta.organizer }
      : undefined,
    location,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  };
}
