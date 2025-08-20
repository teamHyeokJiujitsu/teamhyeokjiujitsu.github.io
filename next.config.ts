/** @type {import('next').NextConfig} */
const repoName = 'team-jiujitsu';          // ★ GitHub 레포명과 100% 동일해야 함
const basePath = `/${repoName}`;

module.exports = {
  output: 'export',                         // 정적 내보내기
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,                                 // 프로젝트 페이지 배포용
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
