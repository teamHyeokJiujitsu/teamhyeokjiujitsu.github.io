/**
 * 홈 대회 목록 아래 링크 묶음 — 유술가들(yusulga.com)의 지역별·달별 대회 일정 페이지와 모아보기 페이지로 보낸다.
 *
 * - 검색 로봇이 그대로 따라가도록 평범한 <a href>(새 창·nofollow 없음). 대회 카드 링크와 같은 방식.
 * - 서버 컴포넌트라 빌드 때 정적 HTML 에 그대로 박힌다(실행 중 fetch 없음).
 *   대회 목록·메타데이터·구조화 데이터·사이트맵·피드는 건드리지 않는다.
 * - 지역은 유술가들 사이트맵에 주짓수 지역 허브로 올라 있는 곳만(2026-11-09 기준 16곳, 세종·제주는 없음).
 *   주소는 유술가들 정식 주소 그대로라 리다이렉트를 거치지 않는다
 *   — /tournaments/region/{지역}(한글은 퍼센트 인코딩), /tournaments/month/{1~12}.
 */
const YUSULGA = 'https://yusulga.com';

const REGIONS = ['서울', '경기', '인천', '강원', '충북', '충남', '대전', '전북', '전남', '광주', '경북', '대구', '경남', '부산', '울산', '일본'];

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MORE = [
  { href: `${YUSULGA}/weekend`, label: '이번 주말 주짓수 대회' },
  { href: `${YUSULGA}/nogi`, label: '노기 주짓수 대회 일정' },
  { href: `${YUSULGA}/venues`, label: '경기장별 주짓수 대회' },
];

export default function YusulgaHubLinks() {
  return (
    <section className="card hub-links">
      <div>
        <h2 className="hub-links__title">지역별 주짓수 대회 일정</h2>
        <ul className="hub-links__list">
          {REGIONS.map(region => (
            <li key={region}>
              <a className="hub-links__chip" href={`${YUSULGA}/tournaments/region/${encodeURIComponent(region)}`}>
                {region}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="hub-links__title">달별 주짓수 대회 일정</h2>
        <ul className="hub-links__list">
          {MONTHS.map(month => (
            <li key={month}>
              <a className="hub-links__chip" href={`${YUSULGA}/tournaments/month/${month}`}>
                {`${month}월`}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="hub-links__title">더 찾아보기</h2>
        <ul className="hub-links__list">
          {MORE.map(item => (
            <li key={item.href}>
              <a className="hub-links__chip" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
