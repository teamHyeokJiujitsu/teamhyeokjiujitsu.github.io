import { getAllNewsMeta, getNewsHtmlBySlug } from '@/lib/content';

export const dynamicParams = false; // 빌드 시점에 있는 페이지만 생성

export function generateStaticParams() {
  return getAllNewsMeta().map(n => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const meta = getAllNewsMeta().find(n => n.slug === params.slug);
  return { title: meta ? meta.title : '뉴스' };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const meta = getAllNewsMeta().find(n => n.slug === params.slug);
  const html = await getNewsHtmlBySlug(params.slug);

  if (!meta) return <div>존재하지 않는 글입니다.</div>;

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
