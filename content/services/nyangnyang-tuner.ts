import type { ServiceDetail } from './types';

export const nyangnyangTuner: ServiceDetail = {
  slug: 'nyangnyang-tuner',
  name: '냥냥 튜너',
  description:
    '초보 집사도 바로 따라 할 수 있는 고양이 케어 루틴 매니저. 급여, 놀이, 건강 체크를 한 번에 정리합니다.',
  status: 'beta',
  statusLabel: '베타 체험판',
  href: '/services/nyangnyang-tuner',
  hero: {
    title: '고양이 생활 루틴을 더 촘촘하게, 냥냥 튜너',
    description:
      '냥냥 튜너는 초보 집사와 바쁜 직장인을 위한 고양이 케어 도우미입니다. 먹이 급여부터 화장실 체크까지 중요한 루틴을 놓치지 않도록 돕습니다.',
    tagline: '고양이와 함께하는 일상을 가장 안정적으로 만드는 방법',
    actions: [
      {
        label: '체험 신청하기',
        href: 'https://forms.gle/your-form-link',
        external: true,
      },
      {
        label: '기획 노트 보기',
        href: 'https://www.notion.so/your-notion-link',
        external: true,
      },
    ],
  },
  features: [
    {
      icon: '📋',
      title: '루틴 플래너',
      description: '급여, 물 교체, 화장실 체크 등 매일 반복되는 케어를 한 화면에서 관리합니다.',
    },
    {
      icon: '⏰',
      title: '알림 자동화',
      description: '시간대별 맞춤 알림으로 집사의 생활 패턴에 맞춘 케어가 가능해집니다.',
    },
    {
      icon: '📈',
      title: '건강 로그',
      description: '체중과 컨디션 변화, 병원 기록을 타임라인으로 정리하여 수의사 상담에 활용할 수 있습니다.',
    },
  ],
  useCases: [
    {
      title: '첫 고양이를 맞이한 집사',
      description: '챙겨야 할 일을 빠뜨리지 않도록 일자별 루틴을 가이드합니다.',
    },
    {
      title: '여러 마리 반려 중인 베테랑 집사',
      description: '고양이별로 케어 루틴을 분리해서 관리하고, 우선순위를 정리할 수 있습니다.',
    },
    {
      title: '원격 근무와 병행하는 직장인',
      description: '출근과 재택 스케줄에 따라 자동으로 바뀌는 맞춤형 알림을 제공합니다.',
    },
  ],
  nextSteps: [
    '베타 기간 동안 사용자 피드백을 수집하고, 가장 많이 요청된 기능을 우선 개발합니다.',
    '고양이 건강 데이터 분석 리포트 기능을 준비하고 있습니다.',
    '제휴 수의사 네트워크와 협력해 믿을 수 있는 케어 콘텐츠를 제공합니다.',
  ],
};
