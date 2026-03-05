'use client';

const COUPANG_LINK = 'https://link.coupang.com/a/diSftp';

export default function AdBanner() {
  return (
    <div className="ad-banner" aria-live="polite">
      <a
        className="ad-banner__frame ad-banner__cta"
        href={COUPANG_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="ad-banner__brand">coupang</span>
        <span className="ad-banner__text">특가 보러가기</span>
      </a>

      <aside className="ad-banner__disclosure" aria-label="쿠팡 파트너스 고지">
        <p>최종 승인을 위해, 활동 페이지의 모든 파트너스 활동 게시물에 대가성 문구를 기재해 주세요.</p>
        <p>
          관련 가이드 바로가기:
          <a href="https://partners.coupang.com/#announcements/93?source=home_banner" target="_blank" rel="noopener noreferrer">
            https://partners.coupang.com/#announcements/93?source=home_banner
          </a>
        </p>
        <p>액션 완료 후 반드시 쿠팡 파트너스 측에 재승인 신청을 진행하시기 바랍니다.</p>
        <p>
          * 쿠팡 파트너스 활동은 공정위 심사 지침에 따라 파트너스 회원과 당사의 경제적 이해관계를 반드시 공개해야 하며,
          미이행 시 부당 광고에 해당할 수 있습니다.
        </p>
      </aside>
    </div>
  );
}
