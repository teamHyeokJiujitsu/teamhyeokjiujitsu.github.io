import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import FancyCursor from '@/components/FancyCursor';
import CursorToggle from '@/components/CursorToggle';
import ThemeToggle from '@/components/ThemeToggle';
import AdBanner from '@/components/AdBanner';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
});

const adsenseClientId =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-2370970936034063';

export const metadata: Metadata = {
  title: '팀혁 – Makers for Better Routines',
  description: '팀혁이 만드는 문제 해결형 앱과 프로젝트를 소개합니다.',
  other: {
    'google-adsense-account': adsenseClientId,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={notoSans.className}>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client={adsenseClientId}
          crossOrigin="anonymous"
        />
        <FancyCursor />
        <a href="#main" className="skip-link">
          본문 바로가기
        </a>
        <header className="header">
          <div className="container">
            <nav className="nav">
              <Link href="/" className="logo">
                팀혁
              </Link>
              <Link href="/#services">프로젝트</Link>
              <Link href="/events">대회 일정</Link>
              <Link href="/news">뉴스</Link>
              <ThemeToggle />
              <CursorToggle />
            </nav>
          </div>
        </header>
        <main id="main" className="container">
          {children}
        </main>
        <footer className="footer">
          <div className="container">
            <div className="small">© {new Date().getFullYear()} TEAMHYEOK</div>
          </div>
        </footer>
        <Link href="/rules" className="rulebook-tab">
          룰 북 보러가기!
        </Link>
        <AdBanner />
      </body>
    </html>
  );
}
