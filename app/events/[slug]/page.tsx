import { getAllEventsMeta } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEventsMeta().map(e => ({ slug: e.slug }));
}

const yusulgaUrl = (slug: string) => `https://yusulga.com/t/${slug}`;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getAllEventsMeta().find(e => e.slug === slug);
  if (!meta) return { title: '대회' };
  return {
    title: meta.title,
    description: meta.excerpt || `${meta.title} 대회 정보`,
    alternates: { canonical: yusulgaUrl(slug) },
    robots: { index: false, follow: true },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const meta = getAllEventsMeta().find(e => e.slug === slug);
  if (!meta) notFound();

  const target = yusulgaUrl(slug);

  return (
    <>
      {/* React 19가 <meta>를 자동으로 head로 hoist */}
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(target)});`,
        }}
      />
      <p style={{ padding: '24px 0', textAlign: 'center' }}>
        잠시 후 유술가들 상세 페이지로 이동합니다.{' '}
        <a href={target}>이동하지 않으면 여기를 클릭</a>
      </p>
    </>
  );
}
