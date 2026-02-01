import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import Link from 'next/link';
import type { Metadata } from 'next';
import Script from 'next/script';
import FancyCursor from '@/components/FancyCursor';
import CursorToggle from '@/components/CursorToggle';
import ThemeToggle from '@/components/ThemeToggle';
import AdBanner from '@/components/AdBanner';
import AdSenseBanner from '@/components/AdSenseBanner';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BJJ 대회 일정',
  description: '주짓수 대회 일정을 한 곳에서!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2370970936034063"
          crossOrigin="anonymous"
        />
      </head>
      <body className={notoSans.className}>
        <FancyCursor />
        <a href="#main" className="skip-link">본문 바로가기</a>
        <header className="header">
          <div className="container">
            <nav className="nav">
              <Link href="/" className="logo">
                BJJ 대회 캘린더
              </Link>
              <ThemeToggle />
              <CursorToggle />
            </nav>
          </div>
        </header>
        <main id="main" className="container">{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="small">© {new Date().getFullYear()} BJJ 대회 정보</div>
          </div>
        </footer>
        <AdSenseBanner />
        <Link href="/rules" className="rulebook-tab">
          룰 북 보러가기!
        </Link>
        <AdBanner />
      </body>
    </html>
  );
}
