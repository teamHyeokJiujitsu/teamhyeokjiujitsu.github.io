import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: '자기암시 · 상세 페이지',
};

const highlights = [
  '루틴에 바로 녹아드는 반복 알림',
  '앱/워치 어디서든 끊김 없는 연동',
  '필요한 시간만 깔끔하게 집중',
];

const features = [
  {
    title: '선명한 루틴 카드',
    description:
      '오늘의 자기암시를 한눈에 보여주고, 완료 상태를 직관적인 색과 진행 바로 표현합니다.',
  },
  {
    title: '단계별 알림 제어',
    description:
      '아침, 낮, 저녁처럼 원하는 시간대만 선택해 반복 노출을 조절할 수 있어 눈에 덜 피로합니다.',
  },
  {
    title: '워치 연동',
    description:
      '손목에서도 같은 문구와 카운터를 바로 확인해 모바일을 켜지 않아도 루틴을 잇습니다.',
  },
  {
    title: '집중 모드',
    description:
      '불필요한 색을 줄이고 대비를 조절한 테마로, 어두운 곳에서도 시선이 분산되지 않습니다.',
  },
];

export default function AffirmationPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.gridOverlay} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.backLink}>
              ← 홈으로
            </Link>
            <span className={styles.badge}>TEAMHYEOK WORKS</span>
          </div>
          <div className={styles.heroContent}>
            <div>
              <p className={styles.kicker}>마인드 트레이닝 · 디테일 페이지</p>
              <h1 className={styles.title}>
                자기암시를
                <br />
                더 선명하게,
                <br />
                더 편안하게
              </h1>
              <p className={styles.lead}>
                말로 되새기고, 원하는 주기로 반복 알림을 받는 자기암시 앱을 눈이 편안한
                딥 그린 톤으로 재구성했습니다. 핵심 문구가 먼저 보이고, 행동 동선은 더
                직관적으로 배치했습니다.
              </p>
              <div className={styles.actions}>
                <Link href="#features" className={styles.primaryCta}>
                  핵심 기능 보기
                </Link>
                <a
                  className={styles.secondaryCta}
                  href="https://www.figma.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  프로토타입 미리보기
                </a>
              </div>
              <div className={styles.highlights}>
                {highlights.map(item => (
                  <span key={item} className={styles.highlightChip}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.preview}>
              <div className={styles.previewCard}>
                <div className={styles.previewHeader}>
                  <span className={styles.previewLabel}>오늘의 자기암시</span>
                  <span className={styles.previewMeta}>AM 06:30 · 루틴 시작</span>
                </div>
                <p className={styles.previewQuote}>
                  “백번 실패한 뒤 가장 먼저 해야 할 건
                  <br />
                  백한번째 도전을 준비하는 것”
                </p>
                <div className={styles.progressRow}>
                  <span>진행률</span>
                  <div className={styles.progressBar}>
                    <span style={{ width: '72%' }} />
                  </div>
                  <span className={styles.progressValue}>72%</span>
                </div>
                <div className={styles.bulletList}>
                  <div className={styles.bullet}>
                    <span className={styles.dot} />
                    아침·점심·저녁 시간대별 알림
                  </div>
                  <div className={styles.bullet}>
                    <span className={styles.dot} />
                    워치와 실시간 연동으로 끊김 없이 복습
                  </div>
                  <div className={styles.bullet}>
                    <span className={styles.dot} />
                    집중 모드에서 주변 노이즈 최소화
                  </div>
                </div>
                <div className={styles.badgeRow}>
                  <span className={styles.badgePill}>데일리 리추얼</span>
                  <span className={styles.badgePill}>iOS · Android</span>
                  <span className={styles.badgePill}>앱·워치 동시 알림</span>
                </div>
              </div>
              <div className={styles.glow} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>디자인 업데이트</p>
            <h2>눈이 편한 딥 그린 톤으로 재정비</h2>
            <p className={styles.sectionLead}>
              대비를 낮추고, 주요 문구와 CTA만 밝게 처리해 사용자가 바로 행동할 수 있도록
              단순화했습니다. 카드와 버튼의 라운드, 폰트 두께, 간격까지 초록 톤 중심으로
              리듬을 맞췄습니다.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map(feature => (
              <div key={feature.title} className={styles.featureCard}>
                <div className={styles.featureIcon} aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
