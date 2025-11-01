import Link from 'next/link';
import styles from './page.module.css';
import { services } from '@/content/services';

export const metadata = {
  title: '팀혁 소개',
};

const teamHighlights = [
  {
    emoji: '🤝',
    title: '협력과 실험',
    description: '팀혁은 다양한 분야의 메이커들이 모여 새로운 아이디어를 빠르게 실험하고 공유합니다.',
  },
  {
    emoji: '🧰',
    title: '문제 해결 중심',
    description: '실제 현장에서 마주한 문제를 해결하는 도구와 서비스를 만들고 있습니다.',
  },
  {
    emoji: '🚀',
    title: '지속 가능한 성장',
    description: '정기적으로 프로젝트를 다듬고, 사용자 피드백을 바탕으로 더 나은 경험을 제공합니다.',
  },
];

export default function Page() {
  return (
    <div>
      <section className={styles.hero}>
        <span className={styles.heroBadge}>TEAMHYEOK</span>
        <h1 className={styles.heroTitle}>팀혁과 함께 만드는 문제 해결형 서비스</h1>
        <p className={styles.heroDescription}>
          팀혁은 일상에서 발견한 불편함을 해결하기 위해 도구와 서비스를 만드는 크리에이터 그룹입니다.
          새로운 아이디어를 실험하고, 함께 성장할 수 있는 이야기들을 이곳에 기록합니다.
        </p>
        <div className={styles.heroActions}>
          <Link href="#services" className={styles.primaryButton}>
            서비스 살펴보기 →
          </Link>
          <Link href="/events" className={styles.secondaryButton}>
            주짓수 대회 일정 보기
          </Link>
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>팀혁이 일하는 방식</h2>
        <p className={styles.sectionDescription}>
          실험과 공유, 그리고 문제 해결이라는 세 가지 키워드로 팀혁의 프로젝트는 시작됩니다.
        </p>
        <div className={styles.featureGrid}>
          {teamHighlights.map((highlight) => (
            <article key={highlight.title} className={styles.featureCard}>
              <span className={styles.featureEmoji} aria-hidden>
                {highlight.emoji}
              </span>
              <h3 className={styles.featureTitle}>{highlight.title}</h3>
              <p className={styles.featureDescription}>{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services">
        <h2 className={styles.sectionTitle}>프로젝트 소개</h2>
        <p className={styles.sectionDescription}>
          팀혁이 만들고 있는 앱과 서비스들을 한 곳에서 만나보세요. 각 프로젝트는 독립적인 공간에서
          더 깊은 이야기를 전합니다.
        </p>
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <article key={service.slug} className={styles.serviceCard}>
              <span className={styles.serviceBadge}>{service.statusLabel}</span>
              <h3 className={styles.serviceTitle}>{service.name}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <Link href={service.href} className={styles.serviceLink}>
                자세히 보기 →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
