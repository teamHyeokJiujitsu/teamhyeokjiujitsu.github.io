import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllEventsMeta } from '@/lib/content';
import EventsList from './events/EventsList';
import EventsListSkeleton from './events/EventsListSkeleton';
import KeywordBlockRemover from '@/components/KeywordBlockRemover';

const SITE_URL = 'https://jiujitsu.teamhyeok.com';

export const metadata: Metadata = {
  title: '2026 주짓수 대회 일정 | 서울·부산·전국 | 신청 링크 포함',
  description:
    '주짓수 대회 일정 (2026) 한눈에 보기. 서울·부산 등 지역별 일정, 노기/기 종목, ADCC KOREA 일정, 접수 링크와 신청 방법까지 정리했습니다.',
  keywords: ['주짓수 대회', '주짓수 대회 일정', '2026 주짓수', 'BJJ 대회', '서울 주짓수 대회', '부산 주짓수 대회', '노기 대회', 'ADCC KOREA', 'IBJJF Seoul', '주짓수 대회 신청'],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: 'BJJ 대회 캘린더',
    title: '2026 주짓수 대회 일정 | 서울·부산·전국',
    description: '국내·국제 주짓수 대회 일정을 한곳에서. 접수 마감일·신청 링크·종목·체급 정보 포함.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function Page() {
  const events = getAllEventsMeta();
  const today = new Date();
  const lastUpdated = today.toISOString().slice(0, 10);
  const lastUpdatedLabel = today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  // 상위 12개 다가오는 대회를 구조화 데이터에 노출 (구글 rich result 후보)
  const upcoming = events
    .filter(e => e.date && new Date(e.date) >= new Date(today.toISOString().slice(0, 10)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 12);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'BJJ 대회 캘린더',
        inLanguage: 'ko-KR',
        description: '국내·국제 주짓수 대회 일정을 한곳에서 확인하는 큐레이션 사이트',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'BJJ 대회 캘린더',
        url: `${SITE_URL}/`,
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#upcoming-events`,
        name: '2026 다가오는 주짓수 대회',
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: upcoming.length,
        itemListElement: upcoming.map((e, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: e.title,
          url: `${SITE_URL}/events/${e.slug}/`,
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: '주짓수 대회 일정은 어디서 확인하나요?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '본 사이트에서 국내(KBJJF, JJAK, 스트릿 주짓수, 지자체 대회 등)와 일본·아시아 메이저(JBJJF, ASJJF, IBJJF, AJP) 일정을 통합 큐레이션합니다. 매일 자동으로 갱신되며 접수 마감일·신청 링크·종목·체급 정보까지 함께 정리합니다.',
            },
          },
          {
            '@type': 'Question',
            name: '주짓수 대회 신청은 어떻게 하나요?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '각 대회 카드의 신청 링크(Spotlite, 공식 페이지, 구글폼 등)에서 직접 접수합니다. 대부분 대회 1~2주 전 마감이며, 얼리버드 가격이 있는 대회는 더 일찍 마감되니 마감일을 확인하세요.',
            },
          },
          {
            '@type': 'Question',
            name: '노기(NO-GI) 대회 일정만 따로 볼 수 있나요?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '대회 목록의 태그 필터에서 nogi를 선택하면 노기 부문 대회만 필터링됩니다. GI/노기를 동시에 운영하는 대회는 두 태그가 함께 표시됩니다.',
            },
          },
        ],
      },
    ],
  };
  // 메인 상단 하이라이트 배너 — active 1개만 노출, 나머지는 백업으로 보존.
  // 다른 대회로 교체하려면 highlightBanner 값을 아래 백업 블록과 바꿔치기하면 됨.
  const highlightBanner = {
    image: '/cos-nagai.png',
    imageAlt: 'COS × 사무엘 나가이 주짓수 대회',
    imagePosition: 'center 35%',
    label: '주요 대회 안내',
    titleLines: ['COS × 사무엘 나가이'],
    detail: 'THE 4th COS BJJ KOREA CUP · 7월 18일(토) · 양주 경동대 메트로폴캠퍼스 · 사무엘 나가이 출전',
    ctaHref: 'https://spotlite.co.kr/jiujitsu/433/participations/create/',
    ctaLabel: '접수 바로가기',
  };
  // [백업] 이전 IBJJF Seoul Open 배너 — 되살리려면 위 highlightBanner를 이 값으로 교체
  // const highlightBanner = {
  //   image: '/advertise2.jpg',
  //   imageAlt: '8월 주요 대회 광고 이미지',
  //   imagePosition: 'center',
  //   label: '주요 대회 안내',
  //   titleLines: ['IBJJF Seoul Open', 'Gi & No-Gi 2026'],
  //   detail: '8월 15일(토)~16일(일) · 서울 서수원칠보체육관',
  //   ctaHref: 'https://www.instagram.com/p/DW4zMEtDD0W/',
  //   ctaLabel: '접수 바로가기',
  // };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KeywordBlockRemover />
      <section className="hero">
        <span className="hero-orb orb1" />
        <span className="hero-orb orb2" />
        <span className="hero-orb orb3" />
        <div className="hero-title-row">
          <h1 className="home-title hero-title">주짓수 대회 일정 (2026)</h1>
          <p className="hero-economic-note">
            <strong>경제적 이해 고지</strong> · 이 페이지에는 제휴 링크가 포함될 수 있으며, 이에 따른 수수료를 제공받을 수 있습니다.
          </p>
        </div>
        <p className="home-intro hero-intro">
          국내 주짓수 대회를 한 번에 확인하세요.
        </p>
        <p className="home-intro" style={{ marginTop: 8 }}>
          <strong>최종 업데이트: <time dateTime={lastUpdated}>{lastUpdatedLabel}</time></strong>
        </p>
        <div className="actions">
          <Link href="#events" className="btn btn-primary">
            대회 보기
          </Link>
          <Link href="/events/closing" className="btn btn-urgent">
            얼마 남지 않은 대회
          </Link>
        </div>

      </section>
      <section className="highlight-banner">
        <div className="highlight-banner-bg">
          <Image
            src={highlightBanner.image}
            alt={highlightBanner.imageAlt}
            width={1920}
            height={800}
            sizes="100vw"
            priority
            style={{ objectPosition: highlightBanner.imagePosition }}
          />
          <div className="highlight-banner-overlay" />
        </div>
        <div className="highlight-banner-content">
          <p className="highlight-banner-label">{highlightBanner.label}</p>
          <h2 className="highlight-banner-title">
            {highlightBanner.titleLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p className="highlight-banner-detail">{highlightBanner.detail}</p>
          <a
            href={highlightBanner.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="highlight-banner-cta"
          >
            {highlightBanner.ctaLabel}
          </a>
          <p className="highlight-banner-biz">
            대회 등록/제휴/광고 문의{' '}
            <a href="mailto:cksgurwkd12@naver.com">cksgurwkd12@naver.com</a>
          </p>
        </div>
      </section>
      <section className="card" style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 12 }}>주요 키워드로 빠르게 찾기</h2>
        <p style={{ marginBottom: 8 }}>
          2026년에 예정된 <strong>주짓수 대회 일정 2026</strong>과 서울에서 열리는{' '}
          <strong>서울 주짓수 대회</strong>, 도복 없이 진행되는 <strong>노기 대회 일정</strong>을
          최신 정보로 정리하고 있습니다.
        </p>
        <p>
          국내·국제 무대를 아우르는 <strong>ADCC KOREA 일정</strong>과 단계별로 따라 할 수 있는{' '}
          <strong>주짓수 대회 신청 방법</strong> 안내도 제공하니, 원하는 대회를 바로 찾아보세요.
        </p>
      </section>
      <section id="events">
        <Suspense fallback={<EventsListSkeleton />}>
          <EventsList events={events} />
        </Suspense>
      </section>
      <section className="card" style={{ marginTop: 32 }}>
        <h2 style={{ marginBottom: 12 }}>자주 묻는 질문</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>주짓수 대회 일정은 어디서 확인하나요?</h3>
            <p style={{ margin: 0 }}>
              본 사이트에서 국내(KBJJF, JJAK, 스트릿 주짓수, 지자체 대회 등)와 일본·아시아 메이저(JBJJF, ASJJF, IBJJF, AJP)
              일정을 통합 큐레이션합니다. 매일 자동으로 갱신되며 접수 마감일·신청 링크·종목(GI/노기)·체급 정보까지 함께 정리합니다.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>주짓수 대회 신청은 어떻게 하나요?</h3>
            <p style={{ margin: 0 }}>
              각 대회 카드의 신청 링크(Spotlite, 공식 페이지, 구글폼 등)에서 직접 접수합니다.
              대부분 대회 1~2주 전 마감이며, 얼리버드 가격이 있는 대회는 더 일찍 마감되니 마감일을 확인하세요.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>노기(NO-GI) 대회 일정만 따로 볼 수 있나요?</h3>
            <p style={{ margin: 0 }}>
              대회 목록의 태그 필터에서 <strong>nogi</strong>를 선택하면 노기 부문 대회만 필터링됩니다.
              GI/노기를 동시에 운영하는 대회는 두 태그가 함께 표시됩니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
