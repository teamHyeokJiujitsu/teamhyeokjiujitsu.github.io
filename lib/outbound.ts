/**
 * 바깥 링크 우회 — 접속이 안 되는 접수처로 바로 보내지 않고 유술가들 대회 상세로 보낸다.
 *
 * 유술가들은 접수처를 30분마다 확인해서, 막혀 있으면 그 접수처를 쓰는 대회 상세 위에
 * 공지를 띄운다(접수처 감시). 여기서 곧장 죽은 사이트로 보내면 손님은 빈 화면만 본다.
 *
 * 스포트라이트: 2026-10 부터 접속 불가(Cloudflare 530). 7/18 서비스 종료 공지가 있었다.
 */
const REROUTED_HOSTS = ['spotlite.co.kr'];

export function yusulgaEventUrl(slug: string): string {
  return `https://yusulga.com/t/${slug}`;
}

/** 우회 대상 접수처면 true. */
export function isReroutedHost(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return REROUTED_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

/** 우회 대상이면 유술가들 대회 상세 주소, 아니면 원래 주소. */
export function outboundUrl(url: string | undefined, slug: string): string | undefined {
  return isReroutedHost(url) ? yusulgaEventUrl(slug) : url;
}
