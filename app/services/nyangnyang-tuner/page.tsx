import Link from 'next/link';
import styles from './styles.module.css';
import { nyangnyangTuner } from '@/content/services/nyangnyang-tuner';

export const metadata = {
  title: '냥냥 튜너 소개',
  description:
    '초보 집사도 바로 따라 할 수 있는 고양이 케어 루틴 매니저 냥냥 튜너를 소개합니다.',
};

export default function NyangnyangTunerPage() {
  const { hero, features, useCases, nextSteps } = nyangnyangTuner;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroTagline}>{hero.tagline}</span>
        <h1 className={styles.heroTitle}>{hero.title}</h1>
        <p className={styles.heroDescription}>{hero.description}</p>
        <div className={styles.heroActions}>
          {hero.actions.map((action, index) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${styles.heroButton} ${
                index === 0 ? styles.primaryButton : styles.secondaryButton
              }`}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noreferrer' : undefined}
            >
              {action.label}
              {action.external ? ' ↗' : ' →'}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>핵심 기능</h2>
        <p className={styles.sectionDescription}>
          냥냥 튜너는 고양이 케어에 필요한 반복 업무를 자동화하고, 중요한 순간을 놓치지 않도록 돕습니다.
        </p>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden>
                {feature.icon}
              </span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>이럴 때 사용해보세요</h2>
        <div className={styles.useCaseList}>
          {useCases.map((useCase) => (
            <article key={useCase.title} className={styles.useCaseItem}>
              <h3 className={styles.useCaseTitle}>{useCase.title}</h3>
              <p className={styles.featureDescription}>{useCase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>다음 계획</h2>
        <p className={styles.sectionDescription}>
          냥냥 튜너는 베타 단계에서 사용자 경험을 꾸준히 검증하고, 고양이와 집사가 함께 행복해지는 경험을 설계하고 있습니다.
        </p>
        <ul className={styles.nextSteps}>
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
