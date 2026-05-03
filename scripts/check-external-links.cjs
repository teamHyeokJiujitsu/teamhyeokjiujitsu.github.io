#!/usr/bin/env node
/**
 * 모든 events md 파일의 sourceUrl, registrationUrl을 검증.
 * - 200~399: OK
 * - 4xx/5xx: BROKEN
 * - 네트워크 오류/타임아웃: UNREACHABLE
 *
 * 출력: 깨진 링크 목록 (slug, field, url, status)
 * 종료코드: 깨진 링크 있으면 1
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const EVENTS_DIR = path.join(process.cwd(), 'content', 'events');
const TIMEOUT_MS = 12000;
const CONCURRENCY = 8;
const RETRIES = 1;
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function collectChecks() {
  const files = fs.readdirSync(EVENTS_DIR).filter(f => f.endsWith('.md'));
  const checks = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(EVENTS_DIR, file), 'utf-8');
    const { data } = matter(raw);
    const slug = file.replace(/\.md$/, '');
    const date = data.date ? new Date(data.date) : null;
    // 지난 대회는 검증 안 함 (출처가 내려가는 게 자연스러움)
    if (date && !Number.isNaN(date.getTime()) && date < TODAY) continue;
    for (const field of ['sourceUrl', 'registrationUrl']) {
      const url = data[field];
      if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
        checks.push({ slug, field, url });
      }
    }
  }
  return checks;
}

async function checkOne(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (LinkChecker; +https://teamhyeokjiujitsu.github.io)' },
    }).catch(() => null);
    // HEAD 거부하는 서버 대비 GET 재시도
    if (!res || res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (LinkChecker; +https://teamhyeokjiujitsu.github.io)' },
      });
    }
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (err) {
    return { ok: false, status: err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR' };
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(url) {
  for (let i = 0; i <= RETRIES; i++) {
    const result = await checkOne(url);
    if (result.ok) return result;
    if (i < RETRIES) await new Promise(r => setTimeout(r, 1500));
    if (i === RETRIES) return result;
  }
}

async function runPool(items, worker, limit) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

(async () => {
  const checks = collectChecks();
  console.log(`Checking ${checks.length} URLs (upcoming events only)...`);
  const results = await runPool(checks, async (c) => {
    const r = await withRetry(c.url);
    return { ...c, ...r };
  }, CONCURRENCY);

  const broken = results.filter(r => !r.ok);
  if (broken.length === 0) {
    console.log('✓ All upcoming-event links are reachable.');
    process.exit(0);
  }

  console.log(`\n✗ ${broken.length} broken/unreachable link(s):\n`);
  for (const b of broken) {
    console.log(`- [${b.slug}] ${b.field} (${b.status})`);
    console.log(`    ${b.url}`);
  }
  process.exit(1);
})();
