import './globals.css';
import { Noto_Sans_KR } from 'next/font/google';
import Link from 'next/link';
import type { Metadata } from 'next';
import ThemeToggle from '@/components/ThemeToggle';
import AdBanner from '@/components/AdBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://teamhyeokjiujitsu.github.io'),
  title: 'BJJ 대회 일정',
  description: '주짓수 대회 일정을 한 곳에서!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={notoSans.className}>
        <a href="#main" className="skip-link">본문 바로가기</a>
        <header className="header">
          <div className="container">
            <nav className="nav">
              <Link href="/" className="logo">
                BJJ 대회 캘린더
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main id="main" className="container">{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="small">© {new Date().getFullYear()} BJJ 대회 정보</div>
          </div>
        </footer>
        <AdBanner />
      </body>
    </html>
  );
}
