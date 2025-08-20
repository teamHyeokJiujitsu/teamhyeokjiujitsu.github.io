// Node 20 이상 가정(글로벌 fetch 존재). CommonJS(.cjs)로 작성.
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const OUT_DIR = path.join(process.cwd(), 'content', 'events');
const SOURCE = 'https://www.street-jiujitsu.com/';

// 한글 도시명 → 슬러그(로마자) 매핑 (필요 시 추가)
const CITY_SLUG = {
  '서울': 'seoul', '부산': 'busan', '대구': 'daegu', '인천': 'incheon', '광주': 'gwangju',
  '대전': 'daejeon', '울산': 'ulsan', '세종': 'sejong', '수원': 'suwon', '천안': 'cheonan',
  '아산': 'asan', '구미': 'gumi', '부천': 'bucheon', '성남': 'seongnam', '용인': 'yongin',
  '청주': 'cheongju', '김포': 'gimpo', '순천': 'suncheon', '전주': 'jeonju', '원주': 'wonju',
  '의정부': 'uijeongbu', '제주': 'jeju', '고양': 'goyang', '진주': 'jinju'
};

// 유틸: 문자열 슬러그화(영문/숫자만)
function toSlug(s) {
  return s.toLowerCase()
    .normalize('NFKD').replace(/[^\w\s-]/g, '')
    .trim().replace(/\s+/g, '-');
}

// YYYY, M월 D일 → YYYY-MM-DD
function toISO(yyyy, mdStr) {
  const m = mdStr.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
  if (!m) return null;
  const mm = String(parseInt(m[1], 10)).padStart(2, '0');
  const dd = String(parseInt(m[2], 10)).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

(async () => {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error('fetch failed: ' + res.status);
  const html = await res.text();
  const $ = cheerio.load(html);

  // 페이지에서 텍스트 라인 추출
  const lines = $('body').text().split('\n').map(s => s.trim()).filter(Boolean);

  // 연도(예: "2025") 찾기
  const yearLine = lines.find(l => /^\d{4}$/.test(l)) || '2025';
  const yyyy = yearLine.match(/\d{4}/)?.[0] || '2025';

  // 1) 날짜 라인들 (예: "8월 23일")
  const dateLines = lines.filter(l => /\d{1,2}\s*월\s*\d{1,2}\s*일/.test(l));

  // 2) 이벤트 라인들 (예: "스트릿 주짓수 119 천안 오픈 (유관순체육관)")
  //    "스트릿 x 리커버리컵 이천 오픈"도 포함
  const eventLines = lines.filter(l =>
    /^스트릿/.test(l) && /오픈/.test(l)
  );

  if (dateLines.length !== eventLines.length) {
    console.warn('[경고] 날짜와 이벤트 라인 개수가 다릅니다. 수동 검수 필요:',
      dateLines.length, eventLines.length);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const n = Math.min(dateLines.length, eventLines.length);
  for (let i = 0; i < n; i++) {
    const dateISO = toISO(yyyy, dateLines[i]);
    const text = eventLines[i];

    // title, city, venue 추출
    // 예: "스트릿 주짓수 119 천안 오픈  (유관순체육관)"
    //     "스트릿 주짓수 구미 오픈  (박정희체육관)"
    //     "스트릿 x 리커버리컵 이천 오픈 (서희청소년센터)"
    const title = text.replace(/\s+/g, ' ').trim();

    const cityMatch =
      title.match(/주짓수\s*\d+\s*([^\s]+)\s*오픈/) ||
      title.match(/주짓수\s+([^\s]+)\s*오픈/) ||
      title.match(/리커버리컵\s*([^\s]+)\s*오픈/);

    const cityKo = cityMatch ? cityMatch[1].replace(/[^\uAC00-\uD7A3A-Za-z]/g, '') : '';
    const citySlug = CITY_SLUG[cityKo] || toSlug(cityKo || 'city');

    const venueMatch = title.match(/\(([^)]+)\)/);
    const venue = venueMatch ? venueMatch[1].trim() : '';

    const slug = `${dateISO || yyyy}-${citySlug}-open`;
    const file = path.join(OUT_DIR, `${slug}.md`);

    const fm = [
      '---',
      `title: "${title}"`,
      `date: "${dateISO || `${yyyy}-01-01`}"`,
      `city: "${cityKo}"`,
      `venue: "${venue}"`,
      `organizer: "Street Jiujitsu"`,
      `tags: ["gi","street"]`,
      `registrationUrl: "${SOURCE}"`,
      `sourceUrl: "${SOURCE}"`,
      '---',
      '',
      `> 출처: Street Jiujitsu 공식 페이지(${SOURCE}). 일정은 변동될 수 있습니다.`,
      ''
    ].join('\n');

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, fm, 'utf-8');
      console.log('✓', path.basename(file));
    } else {
      console.log('… skip (exists)', path.basename(file));
    }
  }
})();
