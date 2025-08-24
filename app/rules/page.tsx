export const metadata = { title: 'IBJJF 룰 요약' };

export default function Page() {
  return (
    <div>
      <h1 className="home-title">IBJJF 룰 요약</h1>
      <p className="home-intro small">
        주요 규정을 간단히 정리한 것으로, 자세한 내용은{' '}
        <a href="https://ibjjf.com/rules" target="_blank" rel="noopener noreferrer">
          IBJJF 공식 룰북
        </a>
        을 참고하세요.
      </p>
      <h2>포인트</h2>
      <ul>
        <li>테이크다운, 패스, 마운트 등 주요 포지션에 따라 2~4점 부여</li>
        <li>어드밴티지: 포인트에 근접한 시도에 대해 기록</li>
        <li>페널티 누적 시 상대에게 포인트/어드밴티지 부여</li>
      </ul>
      <h2>승리 조건</h2>
      <ul>
        <li>서브미션 성공</li>
        <li>포인트 혹은 어드밴티지 우위</li>
        <li>상대 실격 또는 기권</li>
      </ul>
      <h2>주요 반칙</h2>
      <ul>
        <li>슬램, 눈/목/손가락 공격 등 위험 행위</li>
        <li>힐 훅, 리핑 등 특정 관절 기술 (벨트 레벨별 제한)</li>
        <li>경기 지연, 소극적 행동</li>
      </ul>
    </div>
  );
}
