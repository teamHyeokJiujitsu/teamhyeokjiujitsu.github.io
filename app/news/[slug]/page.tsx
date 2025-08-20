import { getAllNewsMeta, getNewsHtmlBySlug } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNewsMeta().map(n => ({ slug: n.slug }));
}

// ✅ Next 15: params는 Promise여서 await 필요
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const meta = getAllNewsMeta().find(n => n.slug === slug);
  return { title: meta ? meta.title : '뉴스' };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const meta = getAllNewsMeta().find(n => n.slug === slug);
  if (!meta) return <div>존재하지 않는 글입니다.</div>;

  const html = await getNewsHtmlBySlug(slug);

  return (
    <article>
      <h1>{meta.title}</h1>
      <div className="small">{new Date(meta.date).toLocaleDateString('ko-KR')}</div>
      {meta.sourceName && meta.sourceUrl ? (
        <div className="small" style={{ marginTop: 4 }}>
          출처: <a href={meta.sourceUrl} target="_blank">{meta.sourceName}</a>
        </div>
      ) : null}
      <div style={{ marginTop: 16 }} dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
