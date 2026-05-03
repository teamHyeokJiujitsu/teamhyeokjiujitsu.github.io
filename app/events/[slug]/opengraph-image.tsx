import { ImageResponse } from 'next/og';
import { getAllEventsMeta } from '@/lib/content';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = '주짓수 대회';

export function generateStaticParams() {
  return getAllEventsMeta().map(e => ({ slug: e.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const meta = getAllEventsMeta().find(e => e.slug === slug);
  const title = meta?.title ?? '주짓수 대회';
  const date = meta?.date ?? '';
  const venue = [meta?.city, meta?.venue].filter(Boolean).join(' · ');
  const tags = (meta?.tags ?? []).slice(0, 4);

  const dateLabel = (() => {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date;
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
    });
  })();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 12, height: 44,
              background: '#fbbf24',
              borderRadius: 4,
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.4, color: '#cbd5e1' }}>
            BJJ 대회 캘린더
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 28, color: '#fbbf24', fontWeight: 600 }}>
            {dateLabel}
          </div>
          <div
            style={{
              fontSize: title.length > 30 ? 60 : 72,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: -1,
              maxWidth: 1056,
            }}
          >
            {title}
          </div>
          {venue && (
            <div style={{ fontSize: 30, color: '#cbd5e1', fontWeight: 500 }}>
              {venue}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <div
                key={t}
                style={{
                  fontSize: 22,
                  padding: '8px 18px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.45)',
                  borderRadius: 8,
                  color: '#fcd34d',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, color: '#94a3b8', fontWeight: 500 }}>
            teamhyeokjiujitsu.github.io
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
