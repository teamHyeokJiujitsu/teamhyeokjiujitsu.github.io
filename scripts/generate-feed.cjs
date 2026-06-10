// 빌드 타임에 content/events/*.md 를 읽어 유술가들(yusulga.com) 연동용
// 대회 JSON 피드(public/api/tournaments.json)를 생성한다.
//
// 설계 원칙:
// - 지터는 서버 없는 정적 사이트(Next export + GitHub Pages)라 동적 API가 없다.
//   대신 이 스크립트가 prebuild 단계에서 정적 JSON을 만들고, GitHub Pages가
//   ETag/Last-Modified 를 자동 부여하므로 폴링 측의 304 조건부 요청도 공짜다.
// - 어떤 경우에도 전체 빌드를 막지 않는다(전체 try/catch + exit 0, 빈 배열 fallback).

const fs = require('fs');
const path = require('path');

const SITE = 'https://jiujitsu.teamhyeok.com';
const EVENTS_DIR = path.join(__dirname, '..', 'content', 'events');
const OUT_DIR = path.join(__dirname, '..', 'public', 'api');
const OUT_FILE = path.join(OUT_DIR, 'tournaments.json');

/** 다양한 입력을 YYYY-MM-DD 로 정규화(아니면 null). */
function toISODate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  const s = String(value).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

/** tags 의 gi/nogi 로 종목 유형 유도. */
function giType(tags) {
  const t = (tags || []).map(x => String(x).toLowerCase());
  const gi = t.includes('gi');
  const nogi = t.includes('nogi') || t.includes('no-gi');
  if (gi && nogi) return 'BOTH';
  if (gi) return 'GI';
  if (nogi) return 'NO_GI';
  return null;
}

/** null/undefined/'' 및 빈 배열 필드 제거. */
function clean(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

try {
  const matter = require('gray-matter'); // 이미 dependencies 에 포함

  const files = fs.existsSync(EVENTS_DIR)
    ? fs.readdirSync(EVENTS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    : [];

  const events = files
    .map(file => {
      const slug = file.replace(/\.mdx?$/, '');
      const raw = fs.readFileSync(path.join(EVENTS_DIR, file), 'utf8');
      const { data } = matter(raw);

      const startDate = toISODate(data.date);
      if (!data.title || !startDate) return null; // 필수(title·startDate) 누락분 제외

      const lastmod = toISODate(data.lastmod);
      const updatedAt = `${lastmod || startDate}T00:00:00Z`;

      return clean({
        // 업서트 키. 불변 id 가 있으면 그것을, 없으면 slug(현재 안정적으로 운용).
        sourceId: data.id ? String(data.id) : slug,
        title: String(data.title),
        organizer: data.organizer ? String(data.organizer) : null,
        startDate,
        endDate: toISODate(data.endDate), // 단일 일정이면 생략됨
        registrationDeadline: toISODate(data.regDeadline),
        registrationUrl: data.registrationUrl ? String(data.registrationUrl) : null,
        venueName: data.venue ? String(data.venue) : null,
        address: data.address ? String(data.address) : null, // 대부분 미보유
        region: data.region ? String(data.region) : null,    // 대부분 미보유(city 로 일부 대체)
        city: data.city ? String(data.city) : null,
        giType: giType(data.tags),
        status: data.status ? String(data.status).toUpperCase() : 'SCHEDULED',
        posterImageUrl: data.cover ? String(data.cover) : null,
        description: data.excerpt ? String(data.excerpt) : null,
        sourceUrl: `${SITE}/events/${slug}/`, // 지터 상세(역링크/참고)
        updatedAt,
      });
    })
    .filter(Boolean)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(events, null, 2) + '\n', 'utf8');
  console.log(`[feed] ${events.length} events -> public/api/tournaments.json`);
} catch (err) {
  // 빌드를 절대 막지 않는다.
  console.error('[feed] 생성 실패(빌드는 계속 진행):', err && err.message);
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    if (!fs.existsSync(OUT_FILE)) fs.writeFileSync(OUT_FILE, '[]\n', 'utf8');
  } catch {}
  process.exit(0);
}
