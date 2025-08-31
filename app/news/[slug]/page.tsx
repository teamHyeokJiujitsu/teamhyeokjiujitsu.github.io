import { getAllNewsMeta, getNewsHtmlBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNewsMeta().map(n => ({ slug: n.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getAllNewsMeta().find(n => n.slug === slug);
  if (!meta) return { title: '뉴스' };
  return {
    title: meta.title,
    description: meta.excerpt || `${meta.title} 관련 소식`,
    keywords: meta.tags || [],
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const meta = getAllNewsMeta().find(n => n.slug === slug);
  if (!meta) notFound();

  const rawHtml = await getNewsHtmlBySlug(slug);
  const html = DOMPurify.sanitize(rawHtml);

  return (
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
        {new Date(meta.date).toLocaleDateString('ko-KR')}
        {meta.sourceName ? ` · ${meta.sourceName}` : ''}
      </div>
      {meta.sourceUrl && (
        <div className="mt-8">
          <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer">
            원문 보기
          </a>
        </div>
      )}
      <div className="mt-16" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
