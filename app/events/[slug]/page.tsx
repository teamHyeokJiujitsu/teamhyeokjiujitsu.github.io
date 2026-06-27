import { getAllEventsMeta } from '@/lib/content';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import RedirectToYusulga from './RedirectToYusulga';

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
      {/* 전체 로드(직접 진입·구글 색인·외부 링크): React 19가 <meta>를 head로 hoist → JS 없이도 이동 */}
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      {/* SPA 클라이언트 내비게이션(옛 캐시 진입 등): useEffect 로도 이동 보장 */}
      <RedirectToYusulga target={target} />
      <p style={{ padding: '24px 0', textAlign: 'center' }}>
        잠시 후 유술가들 상세 페이지로 이동합니다.{' '}
        <a href={target}>이동하지 않으면 여기를 클릭</a>
      </p>
    </>
  );
}
