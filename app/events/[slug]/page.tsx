import { getAllEventsMeta, getEventHtmlBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';
import AddToCalendar from '@/components/AddToCalendar';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEventsMeta().map(e => ({ slug: e.slug }));
}

// ✅ Next 15: params는 Promise여서 await 필요
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getAllEventsMeta().find(e => e.slug === slug);
  if (!meta) return { title: '대회' };
  return {
    title: meta.title,
    description: meta.excerpt || `${meta.title} 대회 정보`,
    keywords: meta.tags || [],
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const meta = getAllEventsMeta().find(e => e.slug === slug);
  if (!meta) notFound();

  const parsedDate = meta.date ? new Date(meta.date) : null;
  const isValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
  const dateLabel = isValidDate ? parsedDate.toLocaleDateString('ko-KR') : '일정 미정';

  const rawHtml = await getEventHtmlBySlug(slug);
  const html = DOMPurify.sanitize(rawHtml);

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: meta.title,
    startDate: isValidDate ? meta.date : undefined,
    description: meta.excerpt || undefined,
    image: meta.cover || undefined,
    url: meta.registrationUrl || undefined,
    organizer: meta.organizer
      ? { '@type': 'Organization', name: meta.organizer }
      : undefined,
    location:
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
        : undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <article>
        {meta.cover && (
          <img
            className="event-cover"
            src={meta.cover}
            alt={meta.title}
            loading="lazy"
          />
        )}
        <h1>{meta.title}</h1>
        <div className="small">
          {dateLabel}
          {meta.city ? ` · ${meta.city}` : ''}{meta.venue ? ` · ${meta.venue}` : ''}
        </div>
        <div className="actions">
          {meta.registrationUrl && (
            <a
              className="btn btn-primary"
              href={meta.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              접수하기
            </a>
          )}
          <AddToCalendar meta={meta} />
          <a
            className="btn btn-outline"
            href={`https://www.google.com/search?q=${encodeURIComponent(meta.title + ' 대회 신청')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            대회 신청 검색
          </a>
        </div>
        <div className="mt-16" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </>
  );
}
