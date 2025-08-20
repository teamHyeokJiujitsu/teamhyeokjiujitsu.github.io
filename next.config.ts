/** @type {import('next').NextConfig} */

const repoName = 'team-jiujitsu';

const basePath = `/${repoName}`;

const nextConfig = {
  // 정적 내보내기(서버 없이 HTML/CSS/JS만 배포)
  output: 'export',

  // 이미지 최적화 서버를 쓰지 않으므로 비활성화
  images: { unoptimized: true },

  // 모든 경로를 /로 끝나게 (GitHub Pages와 궁합 좋음)
  trailingSlash: true,

  // GitHub Pages(프로젝트 페이지)는 /레포명/ 하위 경로에 올라갑니다
  basePath,

  // 코드에서 basePath를 쓸 수 있게 환경변수로도 주입
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

module.exports = nextConfig;
