import { getAllEventsMeta, getEventHtmlBySlug } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEventsMeta().map(e => ({ slug: e.slug }));
}

// ✅ Next 15: params는 Promise여서 await 필요
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const meta = getAllEventsMeta().find(e => e.slug === slug);
  return { title: meta ? meta.title : '대회' };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const meta = getAllEventsMeta().find(e => e.slug === slug);
  if (!meta) return <div>존재하지 않는 대회입니다.</div>;

  const html = await getEventHtmlBySlug(slug);

  return (
    <article>
      <h1>{meta.title}</h1>
      <div className="small">
        {new Date(meta.date).toLocaleDateString('ko-KR')}
        {meta.city ? ` · ${meta.city}` : ''}{meta.venue ? ` · ${meta.venue}` : ''}
      </div>
      {meta.registrationUrl ? (
        <div style={{ marginTop: 8 }}>
          <a href={meta.registrationUrl} target="_blank">접수 링크</a>
        </div>
      ) : null}
      <div style={{ marginTop: 16 }} dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
